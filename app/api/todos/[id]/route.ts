import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await prisma.todo.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const data: any = {};
    if (typeof body.completed === 'boolean') data.completed = body.completed;
    if (body.title) data.title = body.title;
    if (body.description !== undefined) data.description = body.description;

    const updated = await prisma.todo.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}
