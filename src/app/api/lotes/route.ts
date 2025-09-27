import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const lotes = await prisma.lote.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json(lotes)
}

export async function POST(req: Request) {
  const body = await req.json()
  const nuevoLote = await prisma.lote.create({
    data: {
      nombre: body.nombre,
      tipo: body.tipo,
      cantidad: body.cantidad,
      fechaInicio: new Date(body.fechaInicio)
    }
  })
  return NextResponse.json(nuevoLote)
}

export async function PUT(req: Request) {
  const body = await req.json()
  const actualizado = await prisma.lote.update({
    where: { id: body.id },
    data: {
      tipo: body.tipo,
      cantidad: body.cantidad,
      fechaInicio: new Date(body.fechaInicio)
    }
  })
  return NextResponse.json(actualizado)
}

export async function DELETE(req: Request) {
  const body = await req.json()
  await prisma.lote.delete({ where: { id: body.id } })
  return NextResponse.json({ success: true })
}
