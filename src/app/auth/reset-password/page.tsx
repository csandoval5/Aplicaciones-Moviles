'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Typography, Form, Input, Button, notification } from 'antd'

const { Title, Text } = Typography

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!token) {
      notification.error({
        title: 'Token inválido o ausente',
        description: 'No se pudo obtener el token desde el enlace',
        placement: 'topRight',
        duration: 4,
      })
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (res.ok) {
        notification.success({
          title: 'Contraseña actualizada',
          description: 'Ahora puedes iniciar sesión',
          placement: 'topRight',
          duration: 4,
        })
        setTimeout(() => router.push('/auth/login'), 2000)
      } else {
        notification.error({
          title: 'Error',
          description: data.error || 'No se pudo cambiar la contraseña',
          placement: 'topRight',
          duration: 4,
        })
      }
    } catch {
      notification.error({
        title: 'Error de red',
        description: 'No se pudo contactar con el servidor',
        placement: 'topRight',
        duration: 4,
      })
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded shadow text-center max-w-md w-full">
          <Title level={4} style={{ color: '#d4380d' }}>Token inválido</Title>
          <Text>El enlace que recibiste ya expiró o es incorrecto.</Text>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('/images/fondo.jpg')] bg-cover bg-center bg-no-repeat px-4">
      <div className="absolute inset-0 bg-black bg-opacity-30 z-0" />
      <div className="relative z-10 w-full max-w-[440px]">
        <div
          style={{
            background: '#fff',
            padding: 32,
            borderRadius: 12,
            boxShadow: '0 3px 18px rgba(0, 0, 0, 0.07)',
          }}
        >
          <Title level={3} style={{ textAlign: 'center', color: '#1677ff', marginBottom: 16 }}>
            Restablecer contraseña
          </Title>

          <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 28 }}>
            Ingresa tu nueva contraseña para recuperar acceso
          </Text>

          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Nueva contraseña"
              name="password"
              rules={[{ required: true, message: 'Ingresa tu nueva contraseña' }]}
            >
              <Input.Password
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Guardar contraseña
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
