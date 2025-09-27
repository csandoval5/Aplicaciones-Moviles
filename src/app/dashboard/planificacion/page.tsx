'use client'

import { useState, useEffect } from 'react'
import {
  Button,
  Form,
  Select,
  DatePicker,
  Input,
  Card,
  Divider,
  Row,
  Col
} from 'antd'
import dayjs from 'dayjs'

type Evento = {
  id: string
  tipo: string
  descripcion: string
  fecha: string
  lote: {
    id: string
    nombre: string
    tipo: string
  }
}

type Lote = {
  id: string
  nombre: string
  tipo: string
}

export default function PlanificacionPage() {
  const [form] = Form.useForm()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [lotes, setLotes] = useState<Lote[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/eventos')
      .then(res => res.json())
      .then(data => setEventos(data))

    fetch('/api/lotes')
      .then(res => res.json())
      .then(data => setLotes(data))
  }, [])

  const registrarEvento = async (values: any) => {
    if (editingId) {
      const res = await fetch('/api/eventos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          tipo: values.tipo,
          descripcion: values.descripcion,
          fecha: values.fecha
        })
      })
      const actualizado = await res.json()
      setEventos(prev =>
        prev.map(e => (e.id === actualizado.id ? actualizado : e))
      )
      setEditingId(null)
    } else {
      const res = await fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loteId: values.loteId,
          tipo: values.tipo,
          descripcion: values.descripcion,
          fecha: values.fecha
        })
      })
      const nuevo = await res.json()
      setEventos(prev => [nuevo, ...prev])
    }

    form.resetFields()
  }

  const editarEvento = (evento: Evento) => {
    form.setFieldsValue({
      loteId: evento.lote.id,
      tipo: evento.tipo,
      descripcion: evento.descripcion,
      fecha: dayjs(evento.fecha)
    })
    setEditingId(evento.id)
  }

  const eliminarEvento = async (id: string) => {
    await fetch('/api/eventos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    setEventos(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Módulo de Planificación</h1>

      <Divider titlePlacement="left">
        {editingId ? 'Modificar evento' : 'Registrar evento'}
      </Divider>

      <Card style={{ maxWidth: 600, margin: '0 auto' }} variant="outlined">
        <Form form={form} layout="vertical" onFinish={registrarEvento}>
          <Form.Item name="loteId" label="Lote" rules={[{ required: true }]}>
            <Select placeholder="Selecciona un lote" disabled={!!editingId}>
              {lotes.map(lote => (
                <Select.Option key={lote.id} value={lote.id}>
                  {lote.nombre} - {lote.tipo}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="tipo" label="Tipo de acción" rules={[{ required: true }]}>
            <Select placeholder="Selecciona una acción">
              <Select.Option value="Vacuna">Vacuna</Select.Option>
              <Select.Option value="Tratamiento">Tratamiento</Select.Option>
              <Select.Option value="Alimentación">Alimentación</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="descripcion" label="Descripción">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="fecha" label="Fecha" rules={[{ required: true }]}>
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            {editingId ? 'Actualizar evento' : 'Registrar evento'}
          </Button>
        </Form>
      </Card>

      <Divider titlePlacement="left">Eventos recientes</Divider>

      <Row gutter={[16, 16]}>
        {eventos.map(evento => (
          <Col xs={24} md={12} lg={8} key={evento.id}>
            <Card
              title={evento.tipo}
              variant="outlined"
              actions={[
                <Button type="link" onClick={() => editarEvento(evento)}>Modificar</Button>,
                <Button type="link" danger onClick={() => eliminarEvento(evento.id)}>Eliminar</Button>
              ]}
            >
              <p><strong>Lote:</strong> {evento.lote.nombre} - {evento.lote.tipo}</p>
              <p><strong>Fecha:</strong> {dayjs(evento.fecha).format('DD MMM YYYY')}</p>
              <p><strong>Descripción:</strong> {evento.descripcion || 'Sin detalles'}</p>
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
