import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ShopifyService } from '@/lib/shopify'
import { z } from 'zod'

const productUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  tags: z.array(z.string()).optional(),
  metafields: z.array(z.object({
    id: z.string().optional(),
    namespace: z.string(),
    key: z.string(),
    value: z.string(),
    type: z.string(),
  })).optional(),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = productUpdateSchema.parse(body)

    // Await params in Next.js 15+
    const { id } = await params

    // Get the product with store info
    const product = await prisma.product.findFirst({
      where: { id },
      include: {
        store: true,
        tags: true,
        metafields: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Verify the store belongs to the user
    if (product.store.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update in database
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        // If a product-level price was provided, propagate to variants locally
        ...(validatedData.price && {
          variants: {
            updateMany: {
              where: {},
              data: { price: validatedData.price },
            },
          },
        }),
        ...(validatedData.tags && {
          tags: {
            deleteMany: {},
            create: validatedData.tags.map((tag) => ({ tag })),
          },
        }),
        ...(validatedData.metafields && {
          metafields: {
            deleteMany: {},
            create: validatedData.metafields.map((mf) => ({
              shopifyId: mf.id,
              namespace: mf.namespace,
              key: mf.key,
              value: mf.value,
              type: mf.type,
            })),
          },
        }),
      },
      include: {
        variants: true,
        tags: true,
        metafields: true,
      },
    })

    // Sync back to Shopify if it's a Shopify product
    if (product.shopifyId && product.store.platform === 'SHOPIFY') {
      const shopifyService = new ShopifyService(
        product.store.storeUrl,
        product.store.accessToken
      )

      const shopifyData: any = {}
      
      if (validatedData.title) shopifyData.title = validatedData.title
      if (validatedData.description) shopifyData.body_html = validatedData.description
      if (validatedData.tags) shopifyData.tags = validatedData.tags.join(', ')
      // If product-level price was updated, send updated variant prices to Shopify
      if (validatedData.price && updatedProduct.variants) {
        shopifyData.variants = (updatedProduct.variants as any[]).map((v: any) => ({
          id: v.shopifyId,
          price: String(v.price),
          compare_at_price: v.compareAtPrice ? String(v.compareAtPrice) : undefined,
        }))
      }

      await shopifyService.updateProduct(product.shopifyId, shopifyData)

      // Update metafields in Shopify
      if (validatedData.metafields) {
        for (const metafield of validatedData.metafields) {
          if (metafield.id) {
            await shopifyService.updateMetafield(
              product.shopifyId,
              metafield.id,
              metafield
            )
          }
        }
      }
    }

    return NextResponse.json(updatedProduct)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}
