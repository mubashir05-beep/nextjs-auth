import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import * as z from "zod";

const UserSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have than 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = UserSchema.parse(body);
    const existingUser = await db.user.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      return NextResponse.json(
        { user: null, message: "User with this email already exists!" },
        { status: 502 }
      );
    }

    const existingName = await db.user.findUnique({
      where: { username: username },
    });

    if (existingName) {
      return NextResponse.json(
        { user: null, message: "User with this username already exists!" },
        { status: 502 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const { password: newUserPass, ...rest } = newUser;

    return NextResponse.json(
      { user: rest, message: "user created!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "An error occured!" }, { status: 502 });
  }
}
