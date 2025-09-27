'use client'

import { useEffect, useState } from 'react'
import { Form, Input, Select, Button, Card, Divider, message } from 'antd'

export default function ConfiguracionPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/configuracion')
      .then(res => res.json())
      .then(data => {
        const valores = Object.fromEntries(
          data.map((c: any) => [c.clave, c.valor])
        )
        form.setFieldsValue(valores)
      })
  }, [])

  const guardar = async () => {
    setLoading(true)
    try {
      const valores = form.getFieldsValue()
      const claves = Object.keys(valores)

      for (const clave of claves) {
        await fetch('/api/configuracion', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clave, valor: valores[clave] })
        })
      }

      message.success('Configuración actualizada')
    } catch (error) {
      console.error('Error al guardar configuración:', error)
      message.error('Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Módulo de Configuración</h1>
      <Button type="default" href="/dashboard">← Volver</Button>

      <Divider />

      <Card title="Parámetros del sistema" variant="outlined">
        <Form form={form} layout="vertical" onFinish={guardar}>
          <Form.Item name="nombreSistema" label="Nombre del sistema">
            <Input />
          </Form.Item>
          <Form.Item name="idioma" label="Idioma por defecto">
            <Select>
              <Select.Option value="es">Español</Select.Option>
              <Select.Option value="en">Inglés</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="temaVisual" label="Tema visual">
            <Select>
              <Select.Option value="claro">Claro</Select.Option>
              <Select.Option value="oscuro">Oscuro</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="unidadPorDefecto" label="Unidad por defecto">
            <Select>
              <Select.Option value="kg">kg</Select.Option>
              <Select.Option value="litros">litros</Select.Option>
              <Select.Option value="unidades">unidades</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="stockMinimoGlobal" label="Stock mínimo global">
            <Input type="number" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Guardar configuración
          </Button>
        </Form>
      </Card>
    </div>
  )
}
