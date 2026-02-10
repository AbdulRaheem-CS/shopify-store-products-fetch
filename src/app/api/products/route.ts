import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const storeId = searchParams.get('storeId')

    const where: any = {}

    if (storeId) {
      // Verify the store belongs to the user
      const store = await prisma.store.findFirst({
        where: {
          id: storeId,
          userId: session.user.id,
        },
      })

      if (!store) {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 })
      }

      where.storeId = storeId
    } else {
      // Get all products from all user's stores
      const stores = await prisma.store.findMany({
        where: { userId: session.user.id },
        select: { id: true },
      })

      where.storeId = {
        in: stores.map((s: { id: string }) => s.id),
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        store: {
          select: {
            name: true,
            platform: true,
          },
        },
        variants: true,
        tags: true,
        metafields: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
