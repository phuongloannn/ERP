import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  try {
    const token = cookies().get('auth_token')?.value
    const payload = verifyToken(token)

    if (!payload || payload.role !== 'customer') {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const [user] = (await db.query(
      'SELECT id, name, email, phone, is_active, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
      [payload.sub]
    )) as any[]

    if (!user) {
      return Response.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    return Response.json({ success: true, data: user })
  } catch (error) {
    console.error('[API] GET /api/customer/profile error:', error)
    return Response.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const token = cookies().get('auth_token')?.value
    const payload = verifyToken(token)

    if (!payload || payload.role !== 'customer') {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { name, phone } = await request.json()

    await db.query(
      'UPDATE users SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, phone, payload.sub]
    )

    return Response.json({ success: true })
  } catch (error) {
    console.error('[API] PUT /api/customer/profile error:', error)
    return Response.json({ success: false, error: 'Failed to update profile' }, { status: 500 })
  }
}