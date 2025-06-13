'use server';

import { revalidatePath } from 'next/cache';
import { userSchema } from './_lib/validations/userSchema';
import { connectDB } from './_lib/mongodb';
import { User } from './models/User';

export async function addUser(formData: FormData): Promise<void> {
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
    };
  
    const parsed = userSchema.safeParse(data);
    if (!parsed.success) {
      return;
    }

    await connectDB();
    await User.create(parsed.data);

    revalidatePath('/');
  }
