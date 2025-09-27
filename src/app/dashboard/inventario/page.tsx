'use client'

import { useState, useEffect } from 'react'
import {
  Button, Form, Input, Select, InputNumber, DatePicker,
  Card, Row, Col, Divider, Tag, message, Typography
} from 'antd'
import dayjs from 'dayjs'

const { Title, Text } = Typography

type Insumo = {
  id: string
  nombre: string
  categoria: string
  unidad: string
  stock: number
  minimo: number
}

type Movimiento = {
  id: string
  tipo: string
  cantidad: number
  fecha: string
  insumo: {
    nombre: string
    unidad: string
  }
}

export default function InventarioPage() {
  const [form] = Form.useForm()
  const [movForm] = Form.useForm()
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resInsumos, resMovimientos] = await Promise.all([
          fetch('/api/insumos'),
          fetch('/api/movimientos')
        ])

        const insumos = resInsumos.ok ? await resInsumos.json() : []
        const movimientos = resMovimientos.ok ? await resMovimientos.json() : []

        setInsumos(insumos)
        setMovimientos(movimientos)
      } catch (error) {
        console.error('Error al cargar inventario:', error)
        message.error('Error al cargar inventario. Inténtalo de nuevo.')
      }
    }
    cargarDatos()
  }, [])

  const registrarInsumo = async (values: any) => {
    try {
      const res = await fetch('/api/insumos', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...values } : values)
      })

      const texto = await res.text()
      if (!res.ok || !texto.trim()) {
        message.error('Error al registrar insumo.')
        return
      }

      const nuevo = JSON.parse(texto)
      setInsumos(prev =>
        editingId
          ? prev.map(i => (i.id === nuevo.id ? nuevo : i))
          : [nuevo, ...prev]
      )

      form.resetFields()
      setEditingId(null)
      message.success(`Insumo ${editingId ? 'actualizado' : 'registrado'} con éxito.`)
    } catch (error) {
      console.error('Error al registrar insumo:', error)
      message.error('Error al registrar insumo. Inténtalo de nuevo.')
    }
  }

  const editarInsumo = (insumo: Insumo) => {
    form.setFieldsValue(insumo)
    setEditingId(insumo.id)
  }

  const eliminarInsumo = async (id: string) => {
    try {
      const res = await fetch('/api/insumos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, accion: 'eliminar' })
      })

      if (res.ok) {
        setInsumos(prev => prev.filter(i => i.id !== id))
        message.success('Insumo eliminado con éxito.')
      } else {
        const errorData = await res.text()
        console.error('Error al eliminar insumo:', errorData)
        message.error('Error al eliminar insumo. Es posible que esté asociado a movimientos.')
      }
    } catch (error) {
      console.error('Error en la conexión al eliminar insumo:', error)
      message.error('Error de conexión. Inténtalo de nuevo más tarde.')
    }
  }

  const registrarMovimiento = async (values: any) => {
    try {
      const res = await fetch('/api/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, fecha: values.fecha.toISOString() })
      })

      const texto = await res.text()
      if (!res.ok || !texto.trim()) {
        message.error('Error al registrar movimiento.')
        return
      }

      const nuevo = JSON.parse(texto)
      fetch('/api/insumos').then(res => res.json()).then(setInsumos)
      setMovimientos(prev => [nuevo, ...prev])
      movForm.resetFields()
      message.success('Movimiento registrado con éxito.')
    } catch (error) {
      console.error('Error al registrar movimiento:', error)
      message.error('Error al registrar movimiento. Inténtalo de nuevo.')
    }
  }

  const eliminarMovimiento = async (id: string) => {
    try {
      const res = await fetch('/api/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, accion: 'eliminar' })
      })

      if (res.ok || res.status === 404) {
        setMovimientos(prev => prev.filter(m => m.id !== id))
        message.success('Movimiento eliminado y stock revertido correctamente.')
      } else {
        const errorData = await res.text()
        console.error('Error al eliminar movimiento:', errorData)
        message.error('Error al eliminar el movimiento.')
      }
    } catch (error) {
      console.error('Error de conexión al eliminar movimiento:', error)
      message.error('Error de conexión. Inténtalo de nuevo más tarde.')
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        <Title level={2} className="!text-3xl !font-bold !mb-8 !text-center !text-gray-800">Módulo de Inventario</Title>

        <Divider className="!text-xl !font-semibold !text-gray-700" titlePlacement="left">
          {editingId ? 'Modificar Insumo' : 'Registrar Insumo'}
        </Divider>
        <Card className="shadow-lg rounded-lg mb-8" variant="outlined">
          <Form form={form} layout="vertical" onFinish={registrarInsumo}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Por favor, ingresa el nombre del insumo.' }]}>
                  <Input placeholder="Nombre del insumo" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="categoria" label="Categoría" rules={[{ required: true, message: 'Por favor, selecciona una categoría.' }]}>
                  <Select placeholder="Selecciona una categoría">
                    <Select.Option value="Alimentación">Alimentación</Select.Option>
                    <Select.Option value="Medicamento">Medicamento</Select.Option>
                    <Select.Option value="Herramienta">Herramienta</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item name="unidad" label="Unidad" rules={[{ required: true, message: 'Por favor, selecciona una unidad.' }]}>
                  <Select placeholder="Selecciona una unidad">
                    <Select.Option value="kg">kg</Select.Option>
                    <Select.Option value="litros">litros</Select.Option>
                    <Select.Option value="unidades">unidades</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="stock" label="Stock inicial" rules={[{ required: true, message: 'Por favor, ingresa el stock inicial.' }]}>
                  <InputNumber min={0} style={{ width: '100%' }} placeholder="Ej: 50" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="minimo" label="Stock mínimo" rules={[{ required: true, message: 'Por favor, ingresa el stock mínimo.' }]}>
              <InputNumber min={0} style={{ width: '100%' }} placeholder="Ej: 10" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block className="mt-4">
              {editingId ? 'Actualizar Insumo' : 'Registrar Insumo'}
            </Button>
          </Form>
        </Card>

        <Divider className="!text-xl !font-semibold !text-gray-700" titlePlacement="left">
          Registrar Movimiento
        </Divider>
        <Card className="shadow-lg rounded-lg mb-8" variant="outlined">
          <Form form={movForm} layout="vertical" onFinish={registrarMovimiento}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item name="insumoId" label="Insumo" rules={[{ required: true, message: 'Por favor, selecciona un insumo.' }]}>
                  <Select placeholder="Selecciona un insumo">
                    {insumos.map(i => (
                      <Select.Option key={i.id} value={i.id}>
                        {i.nombre} ({i.stock} {i.unidad})
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="tipo" label="Tipo de Movimiento" rules={[{ required: true, message: 'Por favor, selecciona un tipo de movimiento.' }]}>
                  <Select>
                    <Select.Option value="Entrada">Entrada</Select.Option>
                    <Select.Option value="Salida">Salida</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item name="cantidad" label="Cantidad" rules={[{ required: true, message: 'Por favor, ingresa una cantidad.' }]}>
                  <InputNumber min={0.1} step={0.1} style={{ width: '100%' }} placeholder="Cantidad" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="fecha" label="Fecha" rules={[{ required: true, message: 'Por favor, selecciona una fecha.' }]}>
                  <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Button type="primary" htmlType="submit" block className="mt-4">Registrar Movimiento</Button>
          </Form>
        </Card>

        <Divider className="!text-xl !font-semibold !text-gray-700" titlePlacement="left">
          Resumen de Stock
        </Divider>
        <Row gutter={[16, 16]}>
          {insumos.map(i => (
            <Col xs={24} md={12} lg={8} key={i.id}>
              <Card
                title={i.nombre}
                actions={[
                  <Button type="link" onClick={() => editarInsumo(i)}>Modificar</Button>,
                  <Button type="link" danger onClick={() => eliminarInsumo(i.id)}>Eliminar</Button>
                ]}
              >
                <p><strong>Categoría:</strong> {i.categoria}</p>
                <p><strong>Unidad:</strong> {i.unidad}</p>
                <p><strong>Stock actual:</strong> {i.stock} {i.unidad}</p>
                <p><strong>Mínimo requerido:</strong> {i.minimo} {i.unidad}</p>
                {i.stock < i.minimo && (
                  <Tag color="red">⚠️ Stock bajo</Tag>
                )}
              </Card>
            </Col>
          ))}
        </Row>

        <Divider className="!text-xl !font-semibold !text-gray-700" titlePlacement="left">
          Historial de Movimientos
        </Divider>
        <Row gutter={[16, 16]}>
          {movimientos.map(m => (
            <Col xs={24} md={12} lg={8} key={m.id}>
              <Card
                title={m.tipo}
                actions={[
                  <Button type="link" danger onClick={() => eliminarMovimiento(m.id)}>Eliminar</Button>
                ]}
              >
                <p><strong>Insumo:</strong> {m.insumo?.nombre || 'Sin insumo'}</p>
                <p><strong>Cantidad:</strong> {m.cantidad} {m.insumo?.unidad || ''}</p>
                <p><strong>Fecha:</strong> {dayjs(m.fecha).format('DD MMM YYYY')}</p>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="mt-10 text-center">
          <Button type="default" onClick={() => window.location.href = '/dashboard'}>
            Volver al panel
          </Button>
        </div>
      </div>
    </div>
  )
}