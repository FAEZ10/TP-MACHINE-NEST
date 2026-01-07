import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const userRepository = dataSource.getRepository('User');

  const adminExists = await userRepository.findOne({
    where: { role: 'ADMIN' },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    await userRepository.save({
      email: 'admin@devshowcase.com',
      password: hashedPassword,
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      emailValidatedAt: new Date(),
    });

    console.log('Admin user created:');
    console.log('  Email: admin@devshowcase.com');
    console.log('  Password: Admin123!');
  } else {
    console.log('Admin user already exists');
  }

  await app.close();
}

seed()
  .then(() => {
    console.log('Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });

