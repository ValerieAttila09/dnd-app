import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(todos);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;
    if (!title) return NextResponse.json({ error: 'Missing title' }, { status: 400 });

    const todo = await prisma.todo.create({
      data: {
        title,
        description: description ?? null,
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await prisma.todo.deleteMany();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to clear todos' }, { status: 500 });
  }
}
