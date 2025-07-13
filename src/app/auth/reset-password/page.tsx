'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('Procesando...')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('Contraseña actualizada correctamente')
        setTimeout(() => router.push('/auth/login'), 2000)
      } else {
        setStatus(data.error || 'Error inesperado')
      }
    } catch {
      setStatus('Error al conectar con el servidor')
    }
  }

  if (!token) return <p>Token inválido o faltante</p>

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-4">Restablecer contraseña</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Guardar nueva contraseña
        </button>
      </form>
      {status && <p className="mt-4 text-center text-sm text-gray-700">{status}</p>}
    </div>
  )
}
