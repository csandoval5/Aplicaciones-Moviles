import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  // Crear respuesta de redirección
  const response = NextResponse.redirect(
    new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
  )

  // Eliminar la cookie 'auth'
  response.cookies.set('auth', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0), // Fecha en pasado para eliminar
    secure: process.env.NODE_ENV === 'production', // Seguro en producción
    sameSite: 'lax'
  })

  return response
}