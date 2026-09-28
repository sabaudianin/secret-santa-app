import type { EmployeeInput } from '@/lib/employees/actions'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ParseResult = {
  employees: EmployeeInput[]
  errors: string[]
}

export function parseEmployeeList(text: string): ParseResult {
  const employees: EmployeeInput[] = []
  const errors: string[] = []
  const seenEmails = new Set<string>()

  text.split(/\r?\n/).forEach((rawLine, index) => {
    const lineNo = index + 1
    const line = rawLine.trim()
    if (!line) return

    const parts = line.split(/[,;\t]/)
    if (parts.length < 2) {
      errors.push(`Linia ${lineNo}: oczekiwany format "Imię, email"`)
      return
    }

    const name = parts[0].trim()
    const email = parts[parts.length - 1].trim().toLowerCase()

    if (!name) {
      errors.push(`Linia ${lineNo}: brak imienia`)
      return
    }
    if (!EMAIL_REGEX.test(email)) {
      errors.push(`Linia ${lineNo}: niepoprawny adres email (${email})`)
      return
    }
    if (seenEmails.has(email)) {
      errors.push(`Linia ${lineNo}: duplikat adresu ${email}`)
      return
    }

    seenEmails.add(email)
    employees.push({ name, email })
  })

  return { employees, errors }
}