'use client'

import { Layout, Menu, Typography, Avatar } from 'antd'
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import type { ReactNode } from 'react'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

type DashboardLayoutProps = {
  user: string
  children?: ReactNode
}

export default function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const menuItems = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: 'Inicio',
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: 'Perfil',
    },
    {
      key: '3',
      icon: <SettingOutlined />,
      label: 'Configuración',
    },
    {
      key: '4',
      icon: <LogoutOutlined />,
      label: (
        <form action="/api/auth/logout" method="POST">
          <button type="submit" style={{ all: 'unset', cursor: 'pointer' }}>
            Cerrar sesión
          </button>
        </form>
      ),
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: 20,
          }}
        >
          FeedManager
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={menuItems} />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Text type="secondary" style={{ marginRight: 12 }}>
            {user}
          </Text>
          <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
        </Header>

        <Content
          style={{
            margin: '24px',
            background: '#fff',
            padding: 24,
            borderRadius: 8,
          }}
        >
          <Title level={3} style={{ color: '#1677ff' }}>
            ¡Bienvenido, {user}!
          </Title>
          <Text type="secondary">
            Este es tu panel principal. Desde aquí podés gestionar usuarios, revisar métricas o
            personalizar tu cuenta.
          </Text>

          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
