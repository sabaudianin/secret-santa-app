import { createSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

async function login(formData: FormData) {
  'use server'

  const password = formData.get('password') as string
  if (password === process.env.ADMIN_PASSWORD){
    await createSession();
    redirect('/admin');
  }else{
    throw new Error('Wrong Password');
  }
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Logowanie administratora</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={login} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Zaloguj
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}