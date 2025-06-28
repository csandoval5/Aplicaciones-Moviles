import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { parse } from 'cookie'
import DashboardLayout from './DashboardLayout'

export default async function DashboardPage() {
  const headerList = headers()
  const rawCookies = headerList.get('cookie') || ''
  const { auth: user } = parse(rawCookies)

  if (!user) redirect('/')

  return <DashboardLayout user={user} />
}
