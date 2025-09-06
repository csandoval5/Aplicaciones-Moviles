'use client'

import { useState } from 'react'
import { Form, Input, Button, Checkbox, Typography, notification } from 'antd'
import type { FormProps } from 'antd'
import Link from 'next/link'

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

        // ✅ Guardar token si existe
        if (data.token) {
          localStorage.setItem('token', data.token)
        }
      }

      if (!res.ok) {
        notification.error({
          title: 'Inicio de sesión fallido',
          description: mensajeError,
          placement: 'topRight',
          duration: 4,
        })
        return
      }

      notification.success({
        title: 'Sesión iniciada',
        description: 'Bienvenido',
        placement: 'topRight',
        duration: 3,
      })

      window.location.href = '/dashboard'
    } catch {
      notification.error({
        title: 'Error de red',
        description: 'No se pudo contactar con el servidor',
        placement: 'topRight',
        duration: 4,
      })
    } finally {
      setCargando(false)
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

            <div style={{ textAlign: 'right', marginBottom: 12 }}>
              <Link href="/auth/forgot-password" style={{ fontSize: '0.875rem', color: '#1677ff' }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

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
            <Link href="/register" style={{ color: '#1677ff' }}>
              Regístrate
            </Link>
          </Text>
        </div>
      </div>
    </div>
  )
}
