'use client'

import { Form, Input, Button, InputNumber, notification } from 'antd'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [form] = Form.useForm()
  const [modoEdicion, setModoEdicion] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      notification.error({
        message: 'Sesión no válida',
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
            message: 'Error al cargar perfil',
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
          message: 'Perfil actualizado',
          description: 'Tus datos se han guardado correctamente',
          placement: 'topRight',
        })
        setModoEdicion(false)
      } else {
        notification.error({
          message: 'Error al actualizar',
          description: data.error || 'No se pudo guardar el perfil',
          placement: 'topRight',
        })
      }
    } catch (error) {
      console.error('🔥 Error al enviar datos:', error)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Perfil de usuario</h1>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Nombre" name="name">
          <Input disabled={!modoEdicion} />
        </Form.Item>

        <Form.Item label="Teléfono" name="telefono">
          <Input disabled={!modoEdicion} />
        </Form.Item>

        <Form.Item label="Ciudad" name="ciudad">
          <Input disabled={!modoEdicion} />
        </Form.Item>

        <Form.Item label="Edad" name="edad">
          <InputNumber className="w-full" min={0} disabled={!modoEdicion} />
        </Form.Item>

        <Form.Item label="Cargo" name="cargo">
          <Input disabled={!modoEdicion} />
        </Form.Item>
      </Form>

      {/* ✅ Botones separados del formulario */}
      <div className="flex justify-between mt-6">
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
    </div>
  )
}
