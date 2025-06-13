import { connectDB } from '@/app/_lib/mongodb';
import { userSchema } from '@/app/_lib/validations/userSchema';
import { User } from '@/app/models/User';
import { NextRequest, NextResponse } from 'next/server';


export async function GET() {
  await connectDB();
  const users = await User.find();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  const parsed = userSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
  }

  const newUser = await User.create(parsed.data);
  return NextResponse.json(newUser);
}
