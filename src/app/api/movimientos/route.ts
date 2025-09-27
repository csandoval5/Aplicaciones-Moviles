import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const movimientos = await prisma.movimiento.findMany({
      include: { insumo: true },
      orderBy: { fecha: 'desc' }
    })
    return NextResponse.json(movimientos)
  } catch (error) {
    console.error('Error en GET /api/movimientos:', error)
    return new NextResponse(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Lógica para ELIMINAR un movimiento
    if (body.accion === 'eliminar') {
      if (!body.id) {
        return new NextResponse(JSON.stringify({ error: 'ID del movimiento no proporcionado' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // 1. Encontrar el movimiento a eliminar para obtener sus datos
      const movimientoAEliminar = await prisma.movimiento.findUnique({
        where: { id: body.id },
      })

      if (!movimientoAEliminar) {
        return new NextResponse(JSON.stringify({ error: 'Movimiento no encontrado' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // 2. Revertir el stock del insumo asociado
      // Si el movimiento era una 'Entrada', restamos la cantidad; si era una 'Salida', la sumamos.
      const tipoReversion = movimientoAEliminar.tipo === 'Entrada' ? 'decrement' : 'increment'
      await prisma.insumo.update({
        where: { id: movimientoAEliminar.insumoId },
        data: {
          stock: {
            [tipoReversion]: movimientoAEliminar.cantidad
          }
        }
      })

      // 3. Eliminar el movimiento de la base de datos
      await prisma.movimiento.delete({
        where: { id: body.id },
      })

      return NextResponse.json({ success: true, message: 'Movimiento eliminado y stock revertido correctamente.' })
    }

    // Lógica para REGISTRAR un nuevo movimiento
    if (!body.insumoId || !body.tipo || body.cantidad == null || !body.fecha) {
      return new NextResponse(JSON.stringify({ error: 'Datos incompletos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const insumo = await prisma.insumo.findUnique({ where: { id: body.insumoId } })
    if (!insumo) {
      return new NextResponse(JSON.stringify({ error: 'Insumo no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const nuevoStock = body.tipo === 'Entrada'
      ? insumo.stock + body.cantidad
      : insumo.stock - body.cantidad

    await prisma.insumo.update({
      where: { id: body.insumoId },
      data: { stock: nuevoStock }
    })

    const movimiento = await prisma.movimiento.create({
      data: {
        insumoId: body.insumoId,
        tipo: body.tipo,
        cantidad: body.cantidad,
        fecha: new Date(body.fecha)
      },
      include: { insumo: true }
    })

    return NextResponse.json(movimiento)
  } catch (error) {
    console.error('Error en POST /api/movimientos:', error)
    return new NextResponse(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}