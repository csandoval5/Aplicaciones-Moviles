import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { verificarToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization') // Ej: "Bearer eyJhbGciOi..."
  const token = authHeader?.split(' ')[1]

  const datosToken = verificarToken(token)
  if (!datosToken || !datosToken.email) {
    return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 })
  }

  const body = await req.json()
  const { name, telefono, ciudad, edad, cargo } = body

  try {
    const user = await prisma.user.update({
      where: { email: datosToken.email },
      data: {
        name,
        telefono,
        ciudad,
        edad: Number(edad), // Aseguramos tipo número
        cargo,
      },
    })

    return NextResponse.json({ message: 'Perfil actualizado', user })
  } catch (error) {
    console.error('🔥 Error en update-profile:', error)
    return NextResponse.json({ error: 'No se pudo actualizar el perfil' }, { status: 500 })
  }
}
