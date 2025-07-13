import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { email } = await req.json()
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  const token = randomUUID()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15) // 15 min

  await prisma.resetToken.create({
    data: { email, token, expiresAt },
  })

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  })

  await transporter.sendMail({
    to: email,
    subject: 'Recuperación de contraseña',
    html: `
      <h2>Feed Manager</h2>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="http://localhost:3000/auth/reset-password?token=${token}">Restablecer contraseña</a>
    `,
  })

  return NextResponse.json({ message: 'Correo enviado con éxito ✅' })
}
