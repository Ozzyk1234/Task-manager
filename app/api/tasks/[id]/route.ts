import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.task.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to delete task' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { title, description, completed } = await request.json();
    const task = await prisma.task.update({
      where: { id: params.id },
      data: { title, description, completed }
    });
    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to update task' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}