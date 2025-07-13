import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('Admin2025', 10)

  await prisma.user.upsert({
    where: { email: 'admin@feedmanager.com' },
    update: {},
    create: {
      email: 'admin@feedmanager.com',
      password: passwordHash,
      name: 'Administrador',
      rol: 'ADMIN',
    },
  })

  console.log('✅ Usuario administrador creado exitosamente')
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando el seed:', e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
