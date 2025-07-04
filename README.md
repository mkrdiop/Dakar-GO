# fructiFruit - Online Fruit Market

Welcome to fructiFruit, a modern e-commerce application for selling fresh fruits online. This application is built with a powerful stack including Next.js, Supabase, and Genkit for AI-powered features. It includes a customer-facing storefront and a secure admin panel for managing products and orders.

## Features

- **Customer Storefront:** A beautiful and responsive interface for customers to browse fruits, add them to a cart, and place orders.
- **AI-Generated Images:** Product images are generated on-the-fly using Google's Gemini model via Genkit, providing unique and high-quality visuals.
- **Shopping Cart:** A fully functional cart that calculates totals and quantities in real-time.
- **Order Placement:** Customers can place orders by providing a valid Senegalese phone number.
- **Secure Admin Panel:** A password-protected section at `/admin` for shop owners.
  - **Fruit Management:** Add, delete, and view all fruits in the inventory.
  - **Order Management:** View incoming orders, check details, and update their status (Pending, Completed, Cancelled).
  - **User Authentication:** Secure login and sign-up powered by Supabase Auth.
- **Data Persistence:** All fruit and order data is stored and managed in a Supabase PostgreSQL database.

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Database:** [Supabase](https://supabase.io/) (PostgreSQL, Auth)
- **Generative AI:** [Firebase Genkit](https://firebase.google.com/docs/genkit) with Google Gemini
- **Icons:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Getting Started

Follow these instructions to set up and run the project.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or a compatible package manager
- A [Supabase](https://supabase.io/) account

### 2. Set Up Supabase

1.  **Create a Supabase Project:** Go to your [Supabase Dashboard](https://app.supabase.com/) and create a new project.

2.  **Create Database Tables:** In your new project, navigate to the **SQL Editor** and run the following scripts to create the necessary tables.

    **Create the `fruits` table:**
    ```sql
    CREATE TABLE fruits (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      name TEXT NOT NULL,
      price INT NOT NULL,
      image TEXT NOT NULL,
      icon TEXT NOT NULL,
      hint TEXT NOT NULL
    );
    ```

    **Create the `orders` table:**
    ```sql
    CREATE TABLE orders (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        phone_number TEXT NOT NULL,
        total_price INT NOT NULL,
        items JSONB NOT NULL,
        status TEXT DEFAULT 'Pending' NOT NULL
    );
    ```
    
    **(Optional) Populate `fruits` table with sample data:**
    ```sql
    INSERT INTO fruits (name, price, icon, hint, image) VALUES
    ('Pomme', 1500, 'Apple', 'A crisp red apple', 'https://placehold.co/600x400.png'),
    ('Banane', 1200, 'Banana', 'A ripe yellow banana', 'https://placehold.co/600x400.png'),
    ('Orange', 1800, 'Citrus', 'A juicy orange', 'https://placehold.co/600x400.png'),
    ('Raisin', 2500, 'Grape', 'A bunch of purple grapes', 'https://placehold.co/600x400.png'),
    ('Cerise', 3000, 'Cherry', 'A pair of red cherries', 'https://placehold.co/600x400.png'),
    ('Mangue', 2000, 'Leaf', 'A sweet and ripe mango', 'https://placehold.co/600x400.png'),
    ('Ananas', 1800, 'Leaf', 'A tropical pineapple', 'https://placehold.co/600x400.png'),
    ('Fraise', 3500, 'Leaf', 'A fresh red strawberry', 'https://placehold.co/600x400.png'),
    ('Kiwi', 2200, 'Leaf', 'A fuzzy brown kiwi, sliced open', 'https://placehold.co/600x400.png'),
    ('Poire', 1600, 'Leaf', 'A green pear', 'https://placehold.co/600x400.png'),
    ('Pastèque', 4000, 'Leaf', 'A slice of watermelon', 'https://placehold.co/600x400.png');
    ```

### 3. Configure Environment Variables

Open the `.env` file in the root of the project. Add your Supabase Project URL and Anon Key. You can find these in your Supabase project dashboard under **Project Settings > API**.

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 4. Run the Application

With the dependencies already installed, you can start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.
- The customer storefront is at `/`.
- The admin panel is at `/admin`. You will be redirected to `/login` to authenticate first.

### 5. Using Genkit

Genkit is used for AI features. The development server for Genkit can be run in parallel to the Next.js dev server.

To start the Genkit server:

```bash
npm run genkit:dev
```

To watch for changes and restart automatically:
```bash
npm run genkit:watch
```

This will start the Genkit development UI, which you can use to inspect and test your AI flows.
