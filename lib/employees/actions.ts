'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'

export type EmployeeInput = { name: string; email: string }
export type SaveResult = { ok: true } | { ok: false; error: string }

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function saveEmployees(
  eventId: string,
  employees: EmployeeInput[]
): Promise<SaveResult> {
  await requireAdmin()

  const cleaned = employees.map(e => ({
    name: e.name.trim(),
    email: e.email.trim().toLowerCase(),
  }))

  if (cleaned.length < 2) {
    return { ok: false, error: 'Potrzebujesz co najmniej 2 uczestników' }
  }
  if (cleaned.some(e => !e.name || !EMAIL_REGEX.test(e.email))) {
    return { ok: false, error: 'Każda osoba musi mieć imię i poprawny email' }
  }
  const emails = cleaned.map(e => e.email)
  if (new Set(emails).size !== emails.length) {
    return { ok: false, error: 'Na liście są zduplikowane adresy email' }
  }

  const event = await db.event.findUnique({ where: { id: eventId } })
  if (!event) return { ok: false, error: 'Nie znaleziono wydarzenia' }
  if (event.status !== 'DRAFT') {
    return { ok: false, error: 'Losowanie już się odbyło, nie można zmieniać listy' }
  }

  await db.$transaction([
    db.employee.deleteMany({ where: { eventId } }),
    db.employee.createMany({
      data: cleaned.map(e => ({ ...e, eventId })),
    }),
  ])

  revalidatePath(`/admin/events/${eventId}/employees`)
  return { ok: true }
}