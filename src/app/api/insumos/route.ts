import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const insumos = await prisma.insumo.findMany({
      orderBy: { updatedAt: 'desc' }
    })
    return NextResponse.json(insumos)
  } catch (error) {
    console.error('Error en GET /api/insumos:', error)
    return new NextResponse('Error interno del servidor', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (body.accion === 'eliminar') {
      if (!body.id) {
        return new NextResponse('ID no proporcionado', { status: 400 })
      }
      await prisma.insumo.delete({ where: { id: body.id } })
      return NextResponse.json({ success: true })
    }

    const nuevo = await prisma.insumo.create({
      data: {
        nombre: body.nombre,
        categoria: body.categoria,
        unidad: body.unidad,
        stock: body.stock,
        minimo: body.minimo
      }
    })

    return NextResponse.json(nuevo)
  } catch (error) {
    console.error('Error en POST /api/insumos:', error)
    return new NextResponse('Error interno del servidor', { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()

    const actualizado = await prisma.insumo.update({
      where: { id: body.id },
      data: {
        nombre: body.nombre,
        categoria: body.categoria,
        unidad: body.unidad,
        stock: body.stock,
        minimo: body.minimo
      }
    })

    return NextResponse.json(actualizado)
  } catch (error) {
    console.error('Error en PUT /api/insumos:', error)
    return new NextResponse('Error interno del servidor', { status: 500 })
  }
}