'use server';

import { PrismaClient } from '@/lib/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
export const handleSubmit = async (email: string, password: string) => {
  const registerUser = async () => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
        },
      });
      console.log('User registered:', user);
    } catch (error) {
      console.error('Error registering user:', error);
    } finally {
      await prisma.$disconnect();
    }
  };
  registerUser();
};
