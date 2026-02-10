# Shopify Multi-Store Dashboard

A Next.js dashboard application for managing multiple Shopify stores from a single interface. Connect your stores, import products with all their details, edit them, and sync changes back to Shopify.

## Features

- **Multiple Store Management**: Connect and manage multiple Shopify stores
- **Product Import**: Import products with title, description, price, variants, tags, images and metafields
- **Easy Editing**: Edit product details in a user-friendly interface with inline editing and modals
- **Automatic Sync**: Changes are synced back to the remote store (Shopify) when saved
- **Secure Authentication**: User authentication with NextAuth.js (credentials/JWT)
- **Database Storage**: SQLite (development) via Prisma ORM — production can use PostgreSQL or other supported providers
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS and React Icons
- **Extensible**: Architecture designed to support other e-commerce platforms in the future

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4)
- **Database**: SQLite for local development (Prisma). You can swap to PostgreSQL in production.
- **ORM**: Prisma (v7)
- **Authentication**: NextAuth.js (Credentials provider + sessions)
- **API Integration**: Shopify Admin API (via small internal service wrapper)
- **UI/Icons**: React Icons
- **Validation**: Zod (used server-side) and optional React Hook Form in some components

## Prerequisites

- Node.js 18+ and npm
- No database server is required for development (uses SQLite). For production you may choose PostgreSQL and update `DATABASE_URL` accordingly.
- Shopify store(s) with admin access (to create API access tokens)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the project root (example values):

```env
# Database - local development uses SQLite file
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-to-a-secure-random-value"

# (Optional) Shopify credentials for a store used when importing/syncing
# SHOPIFY_STORE_URL="your-store.myshopify.com"
# SHOPIFY_ACCESS_TOKEN="shpat_xxx"
```

Notes:
- For production with PostgreSQL set `DATABASE_URL` to your PostgreSQL connection string.
- Generate `NEXTAUTH_SECRET` securely (e.g. `openssl rand -base64 32`).

### 3. Set up the database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations (creates SQLite file `dev.db` locally)
npx prisma migrate dev --name init
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### Connect a Store

1. Go to the `Stores` page in the dashboard
2. Click `Add Store`
3. Fill in the form:
   - **Store Name**: A friendly name for your store
   - **Platform**: Select `Shopify`
   - **Store URL**: Your Shopify store admin URL (e.g., `https://yourstore.myshopify.com`)
   - **Access Token**: Admin API access token with `read_products` and `write_products` permissions

### Get Shopify Access Token

1. Log in to your Shopify admin
2. Go to Settings → Apps and sales channels → Develop apps
3. Create an app and grant `read_products` and `write_products` scopes
4. Install the app and copy the Admin API access token

### Import and Edit Products

1. Click `Import Products` on any connected store
2. Products will be imported with all details (title, description, images, variants, tags, metafields)
3. Edit products from the `Products` page — edits update the local DB and attempt to sync back to Shopify

If you need per-variant price control, edit variant prices individually; a product-level price will propagate to variants by default.

## Project Structure

```
src/
├── app/
│   ├── api/               # API routes (product listing, product update, stores)
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Dashboard pages (stores, products, layout)
├── components/            # Shared React components (store cards, modals)
├── lib/                   # Utility libraries (Shopify service, prisma client, auth)
├── prisma/                 # Prisma schema & migrations
└── types/                 # TypeScript definitions
```


