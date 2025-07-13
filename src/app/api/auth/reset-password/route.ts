import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { token, password } = await req.json()

  // Verificar token en BD
  const resetRecord = await prisma.resetToken.findUnique({
    where: { token },
  })

  if (!resetRecord || resetRecord.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 })
  }

  // Encriptar nueva contraseña
  const hashedPassword = await bcrypt.hash(password, 10)

  // Actualizar usuario
  await prisma.user.update({
    where: { email: resetRecord.email },
    data: { password: hashedPassword },
  })

  // Eliminar el token usado
  await prisma.resetToken.delete({ where: { token } })

  return NextResponse.json({ message: 'Contraseña actualizada con éxito' })
}
