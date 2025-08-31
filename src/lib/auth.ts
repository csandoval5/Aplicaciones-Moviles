import jwt from 'jsonwebtoken'

const SECRET = process.env.NEXTAUTH_SECRET || 'clave-de-respaldo'

export function verificarToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, SECRET) as { email: string }
    return decoded
  } catch {
    return null
  }
}

