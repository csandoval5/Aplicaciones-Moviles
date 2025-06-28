'use client'

import { useState } from 'react'
import { Form, Input, Button, Typography, notification } from 'antd'
import type { FormProps } from 'antd'

const { Title, Text } = Typography

type FieldType = {
  email?: string
  password?: string
  confirm?: string
}

export default function RegisterPage() {
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setCargando(true)
    setMensaje(null)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: values.email, password: values.password }),
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json()

      if (res.ok) {
        setMensaje('✅ Usuario creado con éxito.')
        notification.success({
          message: 'Registro exitoso 🎉',
          description: 'Tu cuenta fue creada correctamente',
          placement: 'topRight',
          duration: 2.5,
        })

        setTimeout(() => {
          window.location.href = '/auth/login'
        }, 2500)
      } else {
        notification.error({
          message: 'Error al registrar',
          description: data.error || 'Ocurrió un problema inesperado.',
          placement: 'topRight',
        })
      }
    } catch (err) {
      notification.error({
        message: 'Error de conexión',
        description: 'No se pudo conectar al servidor.',
        placement: 'topRight',
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
        <Title level={2} style={{ textAlign: 'center', color: '#1677ff', marginTop: 0, marginBottom: 4 }}>
          Feed Manager
        </Title>

        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 32 }}>
          Ingresá tus datos para registrarte
        </Text>

        {mensaje && (
          <Text style={{ display: 'block', textAlign: 'center', color: '#52c41a', marginBottom: 16 }}>
            {mensaje}
          </Text>
        )}

        <Form layout="vertical" name="register" onFinish={onFinish} autoComplete="off">
          <Form.Item<FieldType>
            label="Correo electrónico"
            name="email"
            rules={[
              { required: true, message: 'Ingresa tu correo' },
              { type: 'email', message: 'Correo no válido' },
            ]}
          >
            <Input placeholder="ejemplo@correo.com" />
          </Form.Item>

          <Form.Item<FieldType>
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Ingresa una contraseña' }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item<FieldType>
            label="Confirmar contraseña"
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Confirma tu contraseña' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="Repite tu contraseña" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={cargando}>
              Registrarme
            </Button>
          </Form.Item>
        </Form>

        <Text style={{ display: 'block', textAlign: 'center', fontSize: '0.9rem', marginTop: 28 }}>
          ¿Ya tienes cuenta?{' '}
          <a href="/auth/login" style={{ color: '#1677ff' }}>
            Inicia sesión
          </a>
        </Text>
      </div>
    </div>
  )
}
