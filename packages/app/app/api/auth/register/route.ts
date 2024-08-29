import { registrationFormSchema } from '@/constants/schemas';
import { fetchSessionData, fetchUserProfileByEmail, insertUser } from '@/db';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { InferType } from 'yup';

type Body = InferType<typeof registrationFormSchema>;

export async function POST(request: Request) {
  try {
    const body: Body = await request.json();
    const valid = await registrationFormSchema.validate(body);

    if (valid) {
      const userExists = await fetchUserProfileByEmail(body.email);
      if (userExists) {
        return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
      }

      const walletExists = await fetchSessionData(body.walletAddress);
      if (walletExists) {
        return NextResponse.json({ error: 'Wallet has already been registered' }, { status: 400 });
      }

      const user = await insertUser({ id: uuidv4(), ...body });
      return NextResponse.json(user);
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'An unexpected server error occurred' }, { status: 500 });
  }
}
