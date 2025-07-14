import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailtest = emailRegex.test(email);
  if (!emailtest) {
    return NextResponse.json(
      { success: false, error: 'Invalid email format' },
      { status: 400 }
    );
  }

  const findUser = await prisma.user.findFirst({
    where: { email },
  });

  if (findUser) {
    return NextResponse.json(
      { success: false, error: 'User already exists' },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'User registration failed' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, user });
}
