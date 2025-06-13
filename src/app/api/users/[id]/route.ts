import { connectDB } from '@/app/_lib/mongodb';
import { userSchema } from '@/app/_lib/validations/userSchema';
import { User } from '@/app/models/User';
import { NextRequest, NextResponse } from 'next/server';


export async function PUT(req: NextRequest, { params }: any) {
  await connectDB();
  const body = await req.json();

  const parsed = userSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
  }

  const updatedUser = await User.findByIdAndUpdate(params.id, parsed.data, { new: true });
  return NextResponse.json(updatedUser);
}

export async function DELETE(_: NextRequest, { params }: any) {
  await connectDB();
  await User.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'User deleted' });
}
