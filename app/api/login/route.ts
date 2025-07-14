import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const tokenSecret = process.env.TOKEN_SECRET;

  if (!tokenSecret) {
    return NextResponse.json(
      { success: false, error: 'Token secret is not set' },
      { status: 500 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailtest = emailRegex.test(email);
  if (!emailtest) {
    return NextResponse.json(
      { success: false, error: 'Invalid email format' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findFirst({
    where: { email },
  });

  const token = jwt.sign({ email: user?.email, id: user?.id }, tokenSecret, {
    expiresIn: '1h',
  });

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'User not found' },
      { status: 401 }
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json(
      { success: false, error: 'Invalid password' },
      { status: 401 }
    );
  }
  const response = NextResponse.json({
    success: true,
    user: user,
    token: token,
  });
  response.cookies.set('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
  return response;
}
