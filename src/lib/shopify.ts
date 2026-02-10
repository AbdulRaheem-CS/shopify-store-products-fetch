export interface ShopifyProduct {
  id: number | string
  title: string
  body_html: string
  variants: ShopifyVariant[]
  tags: string
  image?: {
    src: string
  }
  images?: Array<{
    src: string
  }>
  metafields?: ShopifyMetafield[]
}

export interface ShopifyVariant {
  id: number | string
  title: string
  price: string
  compare_at_price?: string
  sku?: string
  inventory_quantity?: number
  option1?: string
  option2?: string
  option3?: string
}

export interface ShopifyMetafield {
  id?: number | string
  namespace: string
  key: string
  value: string
  type: string
}

export class ShopifyService {
  private shop: string
  private accessToken: string

  constructor(shop: string, accessToken: string) {
    // Clean up shop URL - remove protocol and trailing slashes
    this.shop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '')
    this.accessToken = accessToken
  }

  async fetchProducts() {
    try {
      const response = await fetch(`https://${this.shop}/admin/api/2023-10/products.json`, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json() as { products: ShopifyProduct[] }
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  }

  async fetchProductMetafields(productId: number | string) {
    try {
      const response = await fetch(
        `https://${this.shop}/admin/api/2023-10/products/${productId}/metafields.json`,
        {
          headers: {
            'X-Shopify-Access-Token': this.accessToken,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json() as { metafields: ShopifyMetafield[] }
    } catch (error) {
      console.error('Error fetching metafields:', error)
      throw error
    }
  }

  async updateProduct(productId: number | string, productData: Partial<ShopifyProduct>) {
    try {
      const response = await fetch(
        `https://${this.shop}/admin/api/2023-10/products/${productId}.json`,
        {
          method: 'PUT',
          headers: {
            'X-Shopify-Access-Token': this.accessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product: productData }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  async updateMetafield(productId: number | string, metafieldId: number | string, metafieldData: Partial<ShopifyMetafield>) {
    try {
      const response = await fetch(
        `https://${this.shop}/admin/api/2023-10/products/${productId}/metafields/${metafieldId}.json`,
        {
          method: 'PUT',
          headers: {
            'X-Shopify-Access-Token': this.accessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ metafield: metafieldData }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating metafield:', error)
      throw error
    }
  }
}
