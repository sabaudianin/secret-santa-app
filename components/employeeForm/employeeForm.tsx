'use client'

import { useState, useTransition } from 'react'
import { saveEmployees, type EmployeeInput } from '@/lib/employees/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function EmployeeForm({
  eventId,
  initialEmployees,
}: {
  eventId: string
  initialEmployees: EmployeeInput[]
}) {
  const [rows, setRows] = useState<EmployeeInput[]>(
    initialEmployees.length > 0 ? initialEmployees : [{ name: '', email: '' }]
  )
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  function addRow() {
setRows(prev => [...prev, { name: '', email: '' }])
  }

  function removeRow(index: number) {
     setRows(prev => prev.filter((_, i) => i !== index))
  }
  function updateRow(index: number, field: keyof EmployeeInput, value: string) {
      setRows(prev => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)))
  }

  function handleSave() {
    setError(null)
    setSaved(false)
    startTransition(async () => {
    const result = await saveEmployees(eventId, rows)
    if (result.ok) setSaved(true)
    else setError(result.error)
  })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Liczba uczestników: {rows.length}</p>

      {rows.map((row, index) => (
        <div key={index} className="flex gap-2">
          <Input
            placeholder="Imię"
            value={row.name}
            onChange={e => updateRow(index, 'name', e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={row.email}
            onChange={e => updateRow(index, 'email', e.target.value)}
          />
          <Button type="button" variant="outline" onClick={() => removeRow(index)}>
            ✕
          </Button>
        </div>
      ))}

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={addRow}>
          + Dodaj osobę
        </Button>
        <Button type="button" onClick={handleSave} disabled={isPending}>
          {isPending ? 'Zapisuję...' : 'Zapisz listę'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {saved && (
        <Alert>
          <AlertDescription>Lista zapisana ✅</AlertDescription>
        </Alert>
      )}
    </div>
  )
}