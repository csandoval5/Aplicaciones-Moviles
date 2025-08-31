'use client'

import { useState, useEffect } from 'react'
import { Form, Input, Button, Typography, notification } from 'antd'

const { Title } = Typography

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    // Aquí puedes cargar los datos desde tu API o sesión
    const datosGuardados = {
      email: 'usuario@email.com',
      name: 'Cristian',
      telefono: '0991234567',
      ciudad: 'Puyo',
      edad: 29,
      cargo: 'Desarrollador',
    }

    form.setFieldsValue(datosGuardados)
  }, [])

  const handleSubmit = async (values: any) => {
    setLoading(true)

    try {
      const res = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (res.ok) {
        notification.success({
          title: 'Perfil actualizado',
          description: 'Tus datos se guardaron correctamente',
          placement: 'topRight',
          duration: 3,
        })
      } else {
        notification.error({
          title: 'Error',
          description: data.error || 'No se pudo actualizar el perfil',
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

  return (
    <div className="max-w-xl mx-auto py-10 px-4 bg-white rounded-lg shadow">
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Mi Perfil</Title>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Nombre completo"
          rules={[{ required: true, message: 'Ingresa tu nombre' }]}
        >
          <Input placeholder="Tu nombre" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Correo electrónico"
          rules={[{ required: true, type: 'email', message: 'Correo válido requerido' }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="telefono"
          label="Teléfono"
          rules={[{ required: true, message: 'Ingresa tu teléfono' }]}
        >
          <Input placeholder="0991234567" />
        </Form.Item>

        <Form.Item
          name="ciudad"
          label="Ciudad"
          rules={[{ required: true, message: 'Ingresa tu ciudad' }]}
        >
          <Input placeholder="Ciudad de residencia" />
        </Form.Item>

        <Form.Item
          name="edad"
          label="Edad"
          rules={[{ required: true, type: 'number', min: 1, message: 'Edad válida requerida' }]}
        >
          <Input type="number" placeholder="29" />
        </Form.Item>

        <Form.Item
          name="cargo"
          label="Cargo / Rol"
          rules={[{ required: true, message: 'Ingresa tu cargo' }]}
        >
          <Input placeholder="Desarrollador, Administrador, etc." />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Guardar cambios
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
