import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { parse } from 'cookie'
import DashboardLayout from './DashboardLayout'
import Link from 'next/link'
import { Row, Col, Card } from 'antd'

export default async function DashboardPage() {
  const headerList = await headers()
  const rawCookies = headerList.get('cookie') || ''
  const { auth: user } = parse(rawCookies)

  if (!user) redirect('/')

  return (
    <DashboardLayout user={user}>
      <Row justify="center" gutter={[32, 32]} style={{ marginTop: 48 }}>
        <Col>
          <Link href="/dashboard/animales">
            <Card
              hoverable
              style={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              styles={{
                body: {
                  padding: 0,
                },
              }}
            >
              <img
                src="/icons/animales.jpg"
                alt="Animales"
                style={{
                  width: 80,
                  height: 80,
                  marginBottom: 12,
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
              <div style={{ fontSize: 18, fontWeight: 500 }}>Animales</div>
            </Card>
          </Link>
        </Col>

        <Col>
          <Link href="/dashboard/inventario">
            <Card
              hoverable
              style={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              styles={{
                body: {
                  padding: 0,
                },
              }}
            >
              <img
                src="/icons/inventario.png"
                alt="Inventario"
                style={{
                  width: 80,
                  height: 80,
                  marginBottom: 12,
                  objectFit: 'contain',
                }}
              />
              <div style={{ fontSize: 18, fontWeight: 500 }}>Inventario</div>
            </Card>
          </Link>
        </Col>

        <Col>
          <Link href="/dashboard/planificacion">
            <Card
              hoverable
              style={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              styles={{
                body: {
                  padding: 0,
                },
              }}
            >
              <img
                src="/icons/planificacion.jpg"
                alt="Planificación"
                style={{
                  width: 80,
                  height: 80,
                  marginBottom: 12,
                  objectFit: 'contain',
                }}
              />
              <div style={{ fontSize: 18, fontWeight: 500 }}>Planificación</div>
            </Card>
          </Link>
        </Col>
      </Row>
    </DashboardLayout>
  )
}
