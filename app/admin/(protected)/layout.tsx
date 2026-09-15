import { requireAdmin } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
    return requireAdmin()
  

  return <div className="min-h-screen">{children}</div>
}