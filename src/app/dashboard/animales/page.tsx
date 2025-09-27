'use client'

import { useState, useEffect } from 'react'
import {
  Button,
  InputNumber,
  Select,
  Form,
  Card,
  DatePicker,
  Statistic,
  Row,
  Col,
  Divider
} from 'antd'
import dayjs from 'dayjs'

type AnimalType = '🐖 Cerdos' | '🐔 Pollos'

type Lote = {
  id: string
  nombre: string
  tipo: AnimalType
  cantidad: number
  fechaInicio: string
}

export default function AnimalesPage() {
  const [lotes, setLotes] = useState<Lote[]>([])
  const [form] = Form.useForm()
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/lotes')
      .then(res => res.json())
      .then(data => setLotes(data))
  }, [])

  const resumen = {
    cerdos: lotes.filter(l => l.tipo === '🐖 Cerdos'),
    pollos: lotes.filter(l => l.tipo === '🐔 Pollos')
  }

  const guardarLote = async (values: any) => {
    if (editingId) {
      const res = await fetch('/api/lotes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          tipo: values.tipo,
          cantidad: values.cantidad,
          fechaInicio: values.fechaInicio
        })
      })
      const actualizado = await res.json()
      setLotes(prev =>
        prev.map(l => (l.id === actualizado.id ? actualizado : l))
      )
      setEditingId(null)
    } else {
      const nombre = `Lote ${lotes.length + 1}`
      const res = await fetch('/api/lotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          tipo: values.tipo,
          cantidad: values.cantidad,
          fechaInicio: values.fechaInicio
        })
      })
      const nuevo = await res.json()
      setLotes(prev => [...prev, nuevo])
    }

    form.resetFields()
  }

  const editarLote = (lote: Lote) => {
    form.setFieldsValue({
      tipo: lote.tipo,
      cantidad: lote.cantidad,
      fechaInicio: dayjs(lote.fechaInicio)
    })
    setEditingId(lote.id)
  }

  const eliminarLote = async (id: string) => {
    await fetch('/api/lotes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    setLotes(prev => prev.filter(l => l.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Módulo de Animales</h1>

      <Row gutter={24} className="mb-8">
        <Col xs={24} md={12}>
          <Card variant="outlined" style={{ background: '#f6ffed' }}>
            <h2 className="text-xl font-semibold mb-2">🐖 Cerdos</h2>
            <Statistic title="Total animales" value={resumen.cerdos.reduce((acc, l) => acc + l.cantidad, 0)} />
            <Statistic title="Total lotes" value={resumen.cerdos.length} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card variant="outlined" style={{ background: '#fffbe6' }}>
            <h2 className="text-xl font-semibold mb-2">🐔 Pollos</h2>
            <Statistic title="Total animales" value={resumen.pollos.reduce((acc, l) => acc + l.cantidad, 0)} />
            <Statistic title="Total lotes" value={resumen.pollos.length} />
          </Card>
        </Col>
      </Row>

      <Divider titlePlacement="left">
        {editingId ? 'Modificar lote' : 'Agregar nuevo lote'}
      </Divider>

      <Card className="mb-8" style={{ maxWidth: 600, margin: '0 auto' }} variant="outlined">
        <Form form={form} layout="vertical" onFinish={guardarLote}>
          <Form.Item name="tipo" label="Tipo de animal" rules={[{ required: true }]}>
            <Select placeholder="Selecciona un tipo">
              <Select.Option value="🐖 Cerdos">🐖 Cerdos</Select.Option>
              <Select.Option value="🐔 Pollos">🐔 Pollos</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="cantidad" label="Cantidad" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="fechaInicio" label="Fecha de inicio" rules={[{ required: true }]}>
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            {editingId ? 'Actualizar lote' : 'Agregar lote'}
          </Button>
        </Form>
      </Card>

      <Divider titlePlacement="left">Lotes registrados</Divider>

      <Row gutter={[16, 16]}>
        {lotes.map(lote => (
          <Col xs={24} md={12} lg={8} key={lote.id}>
            <Card
              title={lote.nombre}
              variant="outlined"
              actions={[
                <Button type="link" onClick={() => editarLote(lote)}>Modificar</Button>,
                <Button type="link" danger onClick={() => eliminarLote(lote.id)}>Eliminar</Button>
              ]}
            >
              <p><strong>Tipo:</strong> {lote.tipo}</p>
              <p><strong>Cantidad:</strong> {lote.cantidad}</p>
              <p><strong>Inicio:</strong> {dayjs(lote.fechaInicio).format('DD MMM YYYY')}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="mt-10 text-center">
        <Button type="default" onClick={() => window.location.href = '/dashboard'}>
          Volver
        </Button>
      </div>
    </div>
  )
}
