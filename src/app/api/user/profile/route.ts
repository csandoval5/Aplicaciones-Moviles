import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')

  // Aquí deberías verificar el token y buscar al usuario en tu base de datos
  // Simulación temporal:
  const perfil = {
    name: 'Pepe Urio',
    telefono: '289745687',
    ciudad: 'Puyo',
    edad: 25,
    cargo: 'Empleado',
  }

  return NextResponse.json(perfil)
}
