'use server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@/lib/generated/prisma';
const prisma = new PrismaClient();
export const handleSubmit = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return { success: false, error: 'User not found' };
    } else if (!(await bcrypt.compare(password, user.password))) {
      return { success: false, error: 'Invalid password' };
    }
    return { success: true, user };
  } catch (error: unknown) {
    return {
      success: false,
      error: (error as Error).message || 'Login failed',
    };
  } finally {
    await prisma.$disconnect();
  }
};
