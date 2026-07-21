import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.stat.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.album.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.pack.deleteMany();
  await prisma.event.deleteMany();
  await prisma.photographer.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 10);

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@fotografo.com',
      password,
      name: 'Admin',
      role: UserRole.ADMIN,
    },
  });

  // Photographer
  const photographerUser = await prisma.user.create({
    data: {
      email: 'fotografo@fotografo.com',
      password,
      name: 'João Fotógrafo',
      role: UserRole.PHOTOGRAPHER,
    },
  });

  const photographer = await prisma.photographer.create({
    data: {
      userId: photographerUser.id,
      bio: 'Fotógrafo profissional de eventos com 10 anos de experiência',
      website: 'https://joaofotografo.com',
    },
  });

  // Clients
  const client1 = await prisma.user.create({
    data: {
      email: 'cliente1@fotografo.com',
      password,
      name: 'Maria Silva',
      role: UserRole.CLIENT,
    },
  });

  const client2 = await prisma.user.create({
    data: {
      email: 'cliente2@fotografo.com',
      password,
      name: 'Pedro Santos',
      role: UserRole.CLIENT,
    },
  });

  // Events
  const event1 = await prisma.event.create({
    data: {
      photographerId: photographer.id,
      name: 'Casamento Maria & Pedro',
      description: 'Casamento na Quinta da Rosa',
      date: new Date('2026-09-15'),
      location: 'Quinta da Rosa, Sintra',
      isPublic: true,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      photographerId: photographer.id,
      name: 'Aniversário de 50 anos',
      description: 'Festa de aniversário temática',
      date: new Date('2026-08-20'),
      location: 'Hotel Palácio, Estoril',
      isPublic: true,
    },
  });

  const event3 = await prisma.event.create({
    data: {
      photographerId: photographer.id,
      name: 'Sessão Corporate',
      description: 'Sessão fotográfica empresarial',
      date: new Date('2026-07-10'),
      location: 'Sede da Empresa, Lisboa',
      isPublic: false,
    },
  });

  // Albums
  const album1 = await prisma.album.create({
    data: { eventId: event1.id, name: 'Preparação' },
  });

  const album2 = await prisma.album.create({
    data: { eventId: event1.id, name: 'Cerimónia' },
  });

  const album3 = await prisma.album.create({
    data: { eventId: event1.id, name: 'Festa' },
  });

  const album4 = await prisma.album.create({
    data: { eventId: event2.id, name: 'Principais' },
  });

  // Photos (for stats)
  const photo1 = await prisma.photo.create({
    data: { albumId: album1.id, url: '/photos/photo1.jpg' },
  });

  const photo2 = await prisma.photo.create({
    data: { albumId: album2.id, url: '/photos/photo2.jpg' },
  });

  const photo3 = await prisma.photo.create({
    data: { albumId: album4.id, url: '/photos/photo3.jpg' },
  });

  // Packs
  const pack1 = await prisma.pack.create({
    data: { photographerId: photographer.id, name: 'Pack Básico', price: 500, description: '50 fotos digitais editadas' },
  });

  const pack2 = await prisma.pack.create({
    data: { photographerId: photographer.id, name: 'Pack Premium', price: 1000, description: '150 fotos digitais + álbum' },
  });

  await prisma.pack.create({
    data: { photographerId: photographer.id, name: 'Pack Luxo', price: 2000, description: '300 fotos + álbum + vídeo highlights' },
  });

  // Vehicles (linked to packs)
  await prisma.vehicle.createMany({
    data: [
      { packId: pack1.id, name: 'Canon EOS R5', description: 'Câmara profissional full-frame' },
      { packId: pack2.id, name: 'DJI Mavic 3', description: 'Drone com câmara 4K' },
      { packId: pack2.id, name: 'LED Panel Aputure', description: 'Painel de iluminação LED' },
    ],
  });

  // Reservations
  await prisma.reservation.createMany({
    data: [
      { userId: client1.id, eventId: event1.id, status: 'CONFIRMED' },
      { userId: client2.id, eventId: event2.id, status: 'PENDING' },
    ],
  });

  // Notifications
  await prisma.notification.createMany({
    data: [
      { userId: photographerUser.id, title: 'Nova Reserva', message: 'Maria reservou para o Casamento', type: 'INFO' },
      { userId: client1.id, title: 'Reserva Confirmada', message: 'A sua reserva foi confirmada', type: 'SUCCESS' },
      { userId: photographerUser.id, title: 'Pagamento Recebido', message: 'Pagamento de €500 recebido', type: 'SUCCESS' },
    ],
  });

  // Stats (linked to photos)
  await prisma.stat.createMany({
    data: [
      { photoId: photo1.id, type: 'VIEW' },
      { photoId: photo1.id, type: 'VIEW' },
      { photoId: photo1.id, type: 'FAVORITE' },
      { photoId: photo2.id, type: 'VIEW' },
      { photoId: photo2.id, type: 'DOWNLOAD' },
      { photoId: photo3.id, type: 'VIEW' },
      { photoId: photo3.id, type: 'VIEW' },
      { photoId: photo3.id, type: 'VIEW' },
      { photoId: photo3.id, type: 'SHARE' },
    ],
  });

  console.log('Seed completed!');
  console.log('---');
  console.log('Admin: admin@fotografo.com / password123');
  console.log('Photographer: fotografo@fotografo.com / password123');
  console.log('Client 1: cliente1@fotografo.com / password123');
  console.log('Client 2: cliente2@fotografo.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
