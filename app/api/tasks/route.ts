import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, tasks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch tasks' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json();
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ success: false, error: 'No user found' }, { status: 400 });
    }
    const task = await prisma.task.create({
      data: { title, description, userId: user.id }
    });
    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to create task' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
