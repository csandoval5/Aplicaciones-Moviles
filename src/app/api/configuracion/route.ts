import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const configuraciones = await prisma.configuracion.findMany()
    return NextResponse.json(configuraciones)
  } catch (error) {
    console.error('Error en GET /api/configuracion:', error)
    return new NextResponse('Error interno del servidor', { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()

    const actualizada = await prisma.configuracion.upsert({
      where: { clave: body.clave },
      update: { valor: body.valor },
      create: {
        clave: body.clave,
        valor: body.valor
      }
    })

    return NextResponse.json(actualizada)
  } catch (error) {
    console.error('Error en PUT /api/configuracion:', error)
    return new NextResponse('Error interno del servidor', { status: 500 })
  }
}
