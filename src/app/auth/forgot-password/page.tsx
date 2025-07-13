'use client'

import { useState } from 'react'
import { Typography, Form, Input, Button, notification } from 'antd'

const { Title, Text } = Typography

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  async function handleSubmit() {
    setLoading(true)
    setStatus('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        notification.success({
           title: 'Correo enviado',
          description: 'Revisa tu bandeja para continuar',
          placement: 'topRight',
          duration: 4,
        })
        setStatus('Correo enviado correctamente')
      } else {
        notification.error({
           title: 'Error',
          description: data.error || 'No se pudo enviar el correo',
          placement: 'topRight',
          duration: 4,
        })
        setStatus(data.error || 'Error al enviar el correo')
      }
    } catch {
      notification.error({
        message: 'Error de red',
        description: 'No se pudo contactar con el servidor',
        placement: 'topRight',
        duration: 4,
      })
      setStatus('Error de red')
    } finally {
      setLoading(false)
    }
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
            width: '100%',
            boxShadow: '0 3px 18px rgba(0, 0, 0, 0.07)',
          }}
        >
          <Title level={4} style={{ textAlign: 'center', color: '#555', marginBottom: 0 }}>
            Recupera tu acceso
          </Title>
          <Title level={2} style={{ textAlign: 'center', color: '#1677ff', marginTop: 0, marginBottom: 8 }}>
            Feed Manager
          </Title>

          <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 28 }}>
            Ingresa tu correo registrado y te enviaremos un enlace
          </Text>

          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Correo electrónico"
              name="email"
              rules={[
                { required: true, message: 'Ingresa tu correo' },
                { type: 'email', message: 'Correo no válido' },
              ]}
            >
              <Input
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Enviar enlace
              </Button>
            </Form.Item>
          </Form>

          {status && (
            <Text style={{ display: 'block', textAlign: 'center', marginTop: 16, color: '#555' }}>
              {status}
            </Text>
          )}
        </div>
      </div>
    </div>
  )
}
