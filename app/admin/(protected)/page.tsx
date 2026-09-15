import { destroySession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'

async function logout() {
  'use server'
  await destroySession()
  redirect('/admin/login')
}

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Panel admina</h1>
      <p className="text-muted-foreground mt-2">Zalogowano poprawnie.</p>
      <form action={logout} className="mt-4">
        <Button type="submit" variant="outline">Wyloguj</Button>
      </form>
    </div>
  )
}