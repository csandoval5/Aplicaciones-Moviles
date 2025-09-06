'use client'

import { Button } from 'antd'

export default function InventarioPage() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Módulo de Inventario</h1>

      <Button type="default" onClick={() => window.location.href = '/dashboard'}>
        ← Volver 
      </Button>
    </div>
  )
}
