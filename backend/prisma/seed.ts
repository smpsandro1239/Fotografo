// Seed da base de dados — contas demo + dados de exemplo
// Executar: npx prisma db seed (configurado em package.json)
import { PrismaClient, UserRole, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fotografo.com' },
    update: {},
    create: {
      email: 'admin@fotografo.com',
      password: passwordHash,
      name: 'Administrador',
      role: UserRole.ADMIN,
    },
  });

  // 2. Fotógrafo + perfil
  const photographerUser = await prisma.user.upsert({
    where: { email: 'fotografo@fotografo.com' },
    update: {},
    create: {
      email: 'fotografo@fotografo.com',
      password: passwordHash,
      name: 'Sandro Pereira',
      role: UserRole.PHOTOGRAPHER,
    },
  });

  const photographer = await prisma.photographer.upsert({
    where: { userId: photographerUser.id },
    update: {},
    create: {
      userId: photographerUser.id,
      bio: 'Fotógrafo profissional de eventos e casamentos.',
      website: 'https://example.com',
      portfolio: 'https://example.com/portfolio',
    },
  });

  // 3. Clientes
  const cliente1 = await prisma.user.upsert({
    where: { email: 'cliente1@fotografo.com' },
    update: {},
    create: {
      email: 'cliente1@fotografo.com',
      password: passwordHash,
      name: 'Maria Cliente',
      role: UserRole.CLIENT,
    },
  });

  const cliente2 = await prisma.user.upsert({
    where: { email: 'cliente2@fotografo.com' },
    update: {},
    create: {
      email: 'cliente2@fotografo.com',
      password: passwordHash,
      name: 'João Cliente',
      role: UserRole.CLIENT,
    },
  });

  // 4. Eventos demo
  const wedding = await prisma.event.create({
    data: {
      photographerId: photographer.id,
      name: 'Casamento Ana & Pedro',
      description: 'Casamento no Quinta da Maison, Sintra.',
      date: new Date('2026-06-13T15:00:00Z'),
      location: 'Sintra, Portugal',
      isPublic: true,
    },
  });

  const corporate = await prisma.event.create({
    data: {
      photographerId: photographer.id,
      name: 'Gala Corporativa TechWeek',
      description: 'Cobertura completa do evento anual.',
      date: new Date('2026-03-21T18:30:00Z'),
      location: 'Lisboa, Portugal',
      isPublic: false,
    },
  });

  const birthday = await prisma.event.create({
    data: {
      photographerId: photographer.id,
      name: 'Aniversário 18 anos Leonor',
      description: 'Festa privada em família.',
      date: new Date('2026-09-05T20:00:00Z'),
      location: 'Porto, Portugal',
      isPublic: true,
    },
  });

  // 5. Album + fotos demo
  const album = await prisma.album.create({
    data: {
      eventId: wedding.id,
      name: 'Cerimónia',
      photos: {
        create: [
          { url: 'https://picsum.photos/seed/f1/1200/800', thumbnail: 'https://picsum.photos/seed/f1/300/200' },
          { url: 'https://picsum.photos/seed/f2/1200/800', thumbnail: 'https://picsum.photos/seed/f2/300/200' },
          { url: 'https://picsum.photos/seed/f3/1200/800', thumbnail: 'https://picsum.photos/seed/f3/300/200' },
        ],
      },
    },
    include: { photos: true },
  });

  // 6. Packs + veículos
  const packGold = await prisma.pack.create({
    data: {
      photographerId: photographer.id,
      name: 'Pack Ouro — Casamentos',
      price: 1250.0,
      description: 'Cobertura total, 2 fotógrafos, álbum premium.',
      vehicles: {
        create: [
          { name: 'Viatura A (Sintra)', description: 'Deslocação incluída até 50km', available: true },
          { name: 'Viatura B (Porto)', description: 'Deslocação norte', available: false },
        ],
      },
    },
  });

  await prisma.pack.create({
    data: {
      photographerId: photographer.id,
      name: 'Pack Prata — Eventos',
      price: 650.0,
      description: '4h de cobertura, galeria online.',
    },
  });

  // 7. Reservas demo
  await prisma.reservation.create({
    data: { userId: cliente1.id, eventId: wedding.id, status: 'CONFIRMED' },
  });
  await prisma.reservation.create({
    data: { userId: cliente2.id, eventId: corporate.id, status: 'PENDING' },
  });

  // 8. encomenda multi-item demo
  await prisma.order.create({
    data: {
      userId: cliente1.id,
      status: 'COMPLETED',
      total: 45.0,
      items: {
        create: [
          { type: 'PHOTO', referenceId: album.photos[0].id, name: 'Foto 1200x800 digital', price: 15.0, quantity: 1 },
          { type: 'PRINT', name: 'Impressão 30x40', price: 30.0, quantity: 1 },
        ],
      },
    },
  });

  // 9. Stats demo
  await prisma.stat.createMany({
    data: [
      { photoId: album.photos[0].id, type: 'VIEW' },
      { photoId: album.photos[0].id, type: 'FAVORITE' },
      { photoId: album.photos[1].id, type: 'DOWNLOAD' },
    ],
  });

  // 10. Notificações demo
  await prisma.notification.createMany({
    data: [
      { userId: cliente1.id, type: NotificationType.RESERVATION_CONFIRMED, title: 'Reserva confirmada', message: `A tua reserva para "${wedding.name}" foi confirmada.` },
      { userId: photographerUser.id, type: NotificationType.ORDER_COMPLETED, title: 'Nova encomenda concluída', message: 'Encomenda de 45€ paga com sucesso.' },
      { userId: admin.id, type: NotificationType.INFO, title: 'Seed aplicado', message: 'Dados de demonstração criados com sucesso.' },
    ],
  });

  console.log(
    `Seed concluído: ${[admin, photographerUser, cliente1, cliente2].length} users, 3 eventos, 1 album, ${packGold.name}, reservas, encomendas, stats e notificações.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
