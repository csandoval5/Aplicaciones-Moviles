'use client'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import { Form, Input, Button, Typography, notification } from 'antd'

const { Title, Text } = Typography

const schema = yup.object({
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .test(
      'formato-contraseña',
      'La contraseña debe incluir: al menos 6 caracteres, una letra mayúscula y un número',
      (value) => {
        if (!value) return false
        return value.length >= 6 && /[A-Z]/.test(value) && /\d/.test(value)
      }
    ),
  confirm: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
  email: yup
    .string()
    .email('Correo no válido')
    .required('Ingresa tu correo'),
})

type FormData = yup.InferType<typeof schema>

export default function RegisterPage() {
  const [mensaje, setMensaje] = useState<string | null>(null)

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  })

  const onSubmit = async (values: FormData) => {
    setMensaje(null)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
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

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Form.Item
            label="Correo electrónico"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="ejemplo@correo.com" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password {...field} placeholder="••••••••" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Confirmar contraseña"
            validateStatus={errors.confirm ? 'error' : ''}
            help={errors.confirm?.message}
          >
            <Controller
              name="confirm"
              control={control}
              render={({ field }) => (
                <Input.Password {...field} placeholder="Repite tu contraseña" />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isSubmitting}>
              Registrarme
            </Button>
          </Form.Item>
        </form>

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
