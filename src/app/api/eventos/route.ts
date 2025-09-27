import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const eventos = await prisma.evento.findMany({
    include: { lote: true },
    orderBy: { fecha: 'desc' }
  })
  return NextResponse.json(eventos)
}

export async function POST(req: Request) {
  const body = await req.json()
  const nuevoEvento = await prisma.evento.create({
    data: {
      loteId: body.loteId,
      tipo: body.tipo,
      descripcion: body.descripcion,
      fecha: new Date(body.fecha)
    },
    include: { lote: true }
  })
  return NextResponse.json(nuevoEvento)
}

export async function PUT(req: Request) {
  const body = await req.json()
  const actualizado = await prisma.evento.update({
    where: { id: body.id },
    data: {
      tipo: body.tipo,
      descripcion: body.descripcion,
      fecha: new Date(body.fecha)
    },
    include: { lote: true }
  })
  return NextResponse.json(actualizado)
}

export async function DELETE(req: Request) {
  const body = await req.json()
  await prisma.evento.delete({ where: { id: body.id } })
  return NextResponse.json({ success: true })
}
