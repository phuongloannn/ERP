import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check duplicate email
    const [existing] = (await db.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    )) as any[]

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      )
    }

    const password_hash = await bcrypt.hash(password, 10)

    await db.query(
      'INSERT INTO users (name, email, password_hash, role, phone, is_active) VALUES (?, ?, ?, "customer", ?, true)',
      [name, email, password_hash, phone || null]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] POST /api/auth/register error:', error)
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    )
  }
}
