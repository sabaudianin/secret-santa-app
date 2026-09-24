'use server'

import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function createEvent(formData: FormData) {
  const name = formData.get('name') as string

  if (!name || name.trim().length === 0) {
    throw new Error('Nazwa jest wymagana')
  }

  const event = await db.event.create({
    data: { name: name.trim() },
  })

  redirect(`/admin/events/${event.id}/employees`)
}

export async function getEvents() {
  return db.event.findMany({
    orderBy: { createdAt: 'desc' },
  })
}