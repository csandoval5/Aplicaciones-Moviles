import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const SECRET = process.env.NEXTAUTH_SECRET || 'clave-super-secreta'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email }
    })

    const passwordMatch = user && await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    // 🔐 Generar token JWT
    const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: '1h' })

    // 🍪 Guardar cookie de sesión
    const cookieStore = await cookies()
    cookieStore.set('auth', user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    // 👉 También puedes guardar el token como cookie si quieres
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hora
      path: '/',
    })

    return NextResponse.json({
      success: true,
      token, // ← se puede leer desde frontend si lo necesitas
      redirectTo: '/dashboard',
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
