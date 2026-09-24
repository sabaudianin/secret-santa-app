import { createEvent, getEvents } from '@/lib/events/actions'
import { destroySession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

async function logout() {
  'use server'
  await destroySession()
  redirect('/admin/login')
}

export default async function AdminDashboardPage() {
 
  const events = await getEvents()

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Panel admina</h1>
        <form action={logout}>
          <Button type="submit" variant="outline" size="sm">Wyloguj</Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nowe losowanie</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createEvent} className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="name">Nazwa wydarzenia</Label>
              <Input id="name" name="name" placeholder="np. Świąteczne 2026" required />
            </div>
            <Button type="submit" className="self-end">Utwórz</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Poprzednie wydarzenia</h2>
       {events.map(event => (
         <Link key={event.id} href={`/admin/events/${event.id}/employees`}><Badge>{event.name}</Badge> </Link>
          ))} 
      </div>
    </div>
  )
}