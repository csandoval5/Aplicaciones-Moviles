'use client'

import { Layout, Menu, Typography, Avatar } from 'antd'
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

export default function DashboardLayout({ user }: { user: string }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: 20 }}>
          FeedManager
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>Inicio</Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>Perfil</Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />}>Configuración</Menu.Item>
          <Menu.Item key="4" icon={<LogoutOutlined />}>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" style={{ all: 'unset', cursor: 'pointer' }}>Cerrar sesión</button>
            </form>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text type="secondary" style={{ marginRight: 12 }}>{user}</Text>
          <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
        </Header>

        <Content style={{ margin: '24px', background: '#fff', padding: 24, borderRadius: 8 }}>
          <Title level={3} style={{ color: '#1677ff' }}>¡Bienvenido, {user}!</Title>
          <Text type="secondary">Este es tu panel principal. Desde aquí podés gestionar usuarios, revisar métricas o personalizar tu cuenta.</Text>
        </Content>
      </Layout>
    </Layout>
  )
}
