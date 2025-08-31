import { NextRequest, NextResponse } from 'next/server'
import { verificarToken } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  const datosToken = verificarToken(token)
  if (!datosToken || !datosToken.email) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: datosToken.email },
    select: {
      name: true,
      telefono: true,
      ciudad: true,
      edad: true,
      cargo: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  return NextResponse.json(user)
}
