import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ShopifyService } from '@/lib/shopify'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Await params in Next.js 15+
    const { id } = await params

    // Get the store
    const store = await prisma.store.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    if (store.platform !== 'SHOPIFY') {
      return NextResponse.json(
        { error: 'Only Shopify stores are supported currently' },
        { status: 400 }
      )
    }

    // Fetch products from Shopify
    const shopifyService = new ShopifyService(store.storeUrl, store.accessToken)
    const { products } = await shopifyService.fetchProducts()

    // Import products to database
    let importedCount = 0

    for (const shopifyProduct of products) {
      // Fetch metafields for each product
      const { metafields = [] } = await shopifyService.fetchProductMetafields(
        shopifyProduct.id
      )

      // Check if product already exists
      const existingProduct = await prisma.product.findFirst({
        where: {
          shopifyId: String(shopifyProduct.id),
          storeId: store.id,
        },
      })

      if (existingProduct) {
        // Update existing product
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            title: shopifyProduct.title,
            description: shopifyProduct.body_html,
            price: parseFloat(shopifyProduct.variants[0]?.price || '0'),
            compareAtPrice: shopifyProduct.variants[0]?.compare_at_price
              ? parseFloat(shopifyProduct.variants[0].compare_at_price)
              : null,
            image: shopifyProduct.image?.src || shopifyProduct.images?.[0]?.src || null,
            variants: {
              deleteMany: {},
              create: shopifyProduct.variants.map((variant) => ({
                shopifyId: String(variant.id),
                title: variant.title,
                price: parseFloat(variant.price),
                compareAtPrice: variant.compare_at_price
                  ? parseFloat(variant.compare_at_price)
                  : null,
                sku: variant.sku,
                inventoryQuantity: variant.inventory_quantity,
                option1: variant.option1,
                option2: variant.option2,
                option3: variant.option3,
              })),
            },
            tags: {
              deleteMany: {},
              create: shopifyProduct.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag)
                .map((tag) => ({ tag })),
            },
            metafields: {
              deleteMany: {},
              create: metafields.map((metafield) => ({
                shopifyId: metafield.id ? String(metafield.id) : null,
                namespace: metafield.namespace,
                key: metafield.key,
                value: metafield.value,
                type: metafield.type,
              })),
            },
          },
        })
      } else {
        // Create new product
        await prisma.product.create({
          data: {
            shopifyId: String(shopifyProduct.id),
            title: shopifyProduct.title,
            description: shopifyProduct.body_html,
            price: parseFloat(shopifyProduct.variants[0]?.price || '0'),
            compareAtPrice: shopifyProduct.variants[0]?.compare_at_price
              ? parseFloat(shopifyProduct.variants[0].compare_at_price)
              : null,
            image: shopifyProduct.image?.src || shopifyProduct.images?.[0]?.src || null,
            storeId: store.id,
            variants: {
              create: shopifyProduct.variants.map((variant) => ({
                shopifyId: String(variant.id),
                title: variant.title,
                price: parseFloat(variant.price),
                compareAtPrice: variant.compare_at_price
                  ? parseFloat(variant.compare_at_price)
                  : null,
                sku: variant.sku,
                inventoryQuantity: variant.inventory_quantity,
                option1: variant.option1,
                option2: variant.option2,
                option3: variant.option3,
              })),
            },
            tags: {
              create: shopifyProduct.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag)
                .map((tag) => ({ tag })),
            },
            metafields: {
              create: metafields.map((metafield) => ({
                shopifyId: metafield.id ? String(metafield.id) : null,
                namespace: metafield.namespace,
                key: metafield.key,
                value: metafield.value,
                type: metafield.type,
              })),
            },
          },
        })
      }

      importedCount++
    }

    return NextResponse.json({
      success: true,
      importedCount,
      message: `Successfully imported ${importedCount} products`,
    })
  } catch (error) {
    console.error('Error importing products:', error)
    return NextResponse.json(
      { error: 'Failed to import products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
