'use client'

import {
  Form,
  Input,
  Button,
  InputNumber,
  notification,
  Card,
} from 'antd'
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  IdcardOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [form] = Form.useForm()
  const [modoEdicion, setModoEdicion] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      notification.error({
        title: 'Sesión no válida',
        description: 'Debes iniciar sesión para ver tu perfil',
        placement: 'topRight',
      })
      return
    }

    const cargarPerfil = async () => {
      try {
        const res = await fetch('/api/user/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Respuesta no válida: se esperaba JSON')
        }

        const data = await res.json()
        if (res.ok) {
          form.setFieldsValue(data)
        } else {
          notification.error({
            title: 'Error al cargar perfil',
            description: data.error || 'No se pudo obtener los datos',
            placement: 'topRight',
          })
        }
      } catch (error) {
        console.error('🔥 Error al cargar perfil:', error)
      } finally {
        setCargando(false)
      }
    }

    cargarPerfil()
  }, [form])

  const onFinish = async (values: any) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) return

    try {
      const res = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const data = await res.json()
      if (res.ok) {
        notification.success({
          title: 'Perfil actualizado',
          description: 'Tus datos se han guardado correctamente',
          placement: 'topRight',
        })
        setModoEdicion(false)
      } else {
        notification.error({
          title: 'Error al actualizar',
          description: data.error || 'No se pudo guardar el perfil',
          placement: 'topRight',
        })
      }
    } catch (error) {
      console.error('🔥 Error al enviar datos:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card
        title="Perfil de usuario"
        variant="outlined"
        style={{
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className="p-6">
          <Form.Item label={<><UserOutlined /> Nombre</>} name="name">
            <Input disabled={!modoEdicion} />
          </Form.Item>

          <Form.Item label={<><PhoneOutlined /> Teléfono</>} name="telefono">
            <Input disabled={!modoEdicion} />
          </Form.Item>

          <Form.Item label={<><EnvironmentOutlined /> Ciudad</>} name="ciudad">
            <Input disabled={!modoEdicion} />
          </Form.Item>

          <Form.Item label={<><CalendarOutlined /> Edad</>} name="edad">
            <InputNumber className="w-full" min={0} disabled={!modoEdicion} />
          </Form.Item>

          <Form.Item label={<><IdcardOutlined /> Cargo</>} name="cargo">
            <Input disabled={!modoEdicion} />
          </Form.Item>
        </Form>

        <div className="flex justify-between px-6 pb-6">
          <Button type="default" onClick={() => window.location.href = '/dashboard'}>
            ← Volver
          </Button>

          {!modoEdicion ? (
            <Button type="primary" onClick={() => setModoEdicion(true)}>
              ✏️ Editar perfil
            </Button>
          ) : (
            <Button type="primary" onClick={() => form.submit()}>
              💾 Guardar perfil
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
