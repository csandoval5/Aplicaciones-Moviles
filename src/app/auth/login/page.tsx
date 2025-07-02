'use client'

import { useState } from 'react'
import { Form, Input, Button, Checkbox, Typography, notification } from 'antd'
import type { FormProps } from 'antd'

const { Title, Text } = Typography

type FieldType = {
  email?: string
  password?: string
  remember?: boolean
}

export default function LoginPage() {
  const [cargando, setCargando] = useState(false)

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setCargando(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      })

      let mensajeError = 'Credenciales incorrectas'
      const contentType = res.headers.get('content-type')

      if (contentType && contentType.includes('application/json')) {
        const data = await res.json()
        mensajeError = data.error || mensajeError
      }

      if (!res.ok) {
        notification.error({
          message: 'Inicio de sesión fallido',
          description: mensajeError,
          placement: 'topRight',
          duration: 4,
        })
        return
      }

      notification.success({
        message: 'Sesión iniciada',
        description: 'Redirigiendo al dashboard...',
        placement: 'topRight',
        duration: 3,
      })
      window.location.href = '/dashboard'
    } catch {
      notification.error({
        message: 'Error de red',
        description: 'No se pudo contactar con el servidor',
        placement: 'topRight',
        duration: 4,
      })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4">
      <div
        style={{
          background: '#fff',
          padding: 32,
          borderRadius: 12,
          width: '100%',
          maxWidth: 440,
          boxShadow: '0 3px 18px rgba(0, 0, 0, 0.07)',
        }}
      >
        <Title level={4} style={{ textAlign: 'center', color: '#555', marginBottom: 0 }}>
          Bienvenido a
        </Title>
        <Title level={2} style={{ textAlign: 'center', color: '#1677ff', marginTop: 0, marginBottom: 8 }}>
          Feed Manager
        </Title>

        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 28 }}>
          Ingresa tus credenciales para continuar
        </Text>

        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Correo electrónico"
            name="email"
            rules={[
              { required: true, message: 'Ingresa tu correo' },
              { type: 'email', message: 'Correo no válido' },
            ]}
          >
            <Input placeholder="tucorreo@ejemplo.com" />
          </Form.Item>

          <Form.Item<FieldType>
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item<FieldType> name="remember" valuePropName="checked">
            <Checkbox>Recordarme</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={cargando}>
              Iniciar sesión
            </Button>
          </Form.Item>
        </Form>

        <Text style={{ display: 'block', textAlign: 'center', fontSize: '0.9rem', marginTop: 28 }}>
          ¿No tienes cuenta?{' '}
          <a href="/register" style={{ color: '#1677ff' }}>
            Regístrate
          </a>
        </Text>
      </div>
    </div>
  )
}
