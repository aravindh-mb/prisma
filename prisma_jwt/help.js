const faker = require('faker');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
    try {
      // Generate fake data using faker
      const clients = [];
      for (let i = 0; i < 10; i++) {
        const name = faker.name.firstName();
        const email = faker.internet.email();
        clients.push({ name, email });
      }
  
      // Seed the client table with the generated data
      await prisma.client.createMany({
        data: clients,
      });
  
      console.log('Data seeded successfully.');
    } catch (error) {
      // Disconnect Prisma client
      console.error('Error seeding data:', error);
    } finally {
      await prisma.$disconnect();
    }
  }
  
  seed();
  