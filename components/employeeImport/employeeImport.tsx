'use client'

import { useState } from 'react'
import { parseEmployeeList } from '@/lib/employees/parse'
import type { EmployeeInput } from '@/lib/employees/actions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function EmployeeImport({
  onImport,
}: {
  // Zwraca listę komunikatów o pominiętych osobach (np. duplikaty względem istniejących wierszy)
  onImport: (employees: EmployeeInput[]) => string[]
}) {
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  function handleImport() {
    // TODO 6: sparsuj tekst, przekaż poprawne osoby do onImport i zbierz komunikaty
    // Hint: const { employees, errors } = parseEmployeeList(text)
    //       const skipped = onImport(employees)
    //       setMessages([...errors, ...skipped])
    // Potem wyczyść textarea TYLKO jeśli nie było żadnych komunikatów (żeby admin mógł poprawić błędne linie)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="import">Wklej listę (jedna osoba na linię: Imię, email)</Label>
      <textarea
        id="import"
        value={text}
        onChange={e => setText(e.target.value)}
        rows={6}
        placeholder={'Anna Kowalska, anna@firma.pl\nJan Nowak, jan@firma.pl'}
        className="w-full rounded-md border bg-background p-2 text-sm"
      />
      <Button type="button" variant="outline" onClick={handleImport} disabled={!text.trim()}>
        Importuj listę
      </Button>

      {messages.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <ul className="list-disc pl-4">
              {messages.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}