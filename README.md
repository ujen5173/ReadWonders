# StoryNest

Welcome to StoryNest, a robust community platform designed for creators to compose and share their narratives, articulate their emotions, and engage with a supportive audience. Whether you are an experienced writer or a novice, StoryNest offers a versatile environment to unleash your creativity and refine your voice.

> **Warning**
> This is a work-in-progress and not the finished product.
>
> StoryNest is in its very early days of development. We are working hard to provide an initial version as soon as possible and are accepting contributions.
>
> Feel free to leave feature suggestions but please don't open issues for bugs or support requests just yet.
>
> Follow me on GitHub [@ujen5173](https://github.com/ujen5173) for updates.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Supabase Setup](#supabase-setup)
  - [Running the Project](#running-the-project)
- [Contributing](#contributing)

## Tech Stack

- **Next.js**
- **Tailwind CSS**
- **Prisma**
- **Supabase**
- **TRPC**
- **Posthog**
- **Uploadthing**

## Features

- Offline Support
- Collaborative Writing
- Discussion Threads
- Achievements
- Live Writing Sessions
- Write Stories with AI Writing Assistant
- Like, Comment on Stories, Follow Creators, Notifications
- Personalized Feed
- Premium Subscription for Exclusive Content
- Schedule Stories

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- Node.js
- pnpm
- Supabase

### Installation

1. Clone the repository:

```bash
  git clone https://github.com/your-username/storynest.git
```

2. Navigate to the project directory:

```bash
  cd storynest
```

3. Install dependencies:

```bash
  pnpm install
```

4. Set up environment variables:

Create a `.env` file in the root directory and add the environment variables referenced in the `.env.example` file.

### Supabase Setup

1. Create an account on [Supabase](https://supabase.com/).
2. Populate the API keys in the `.env` file as referenced in `.env.example`.
3. Push the Prisma schema to Supabase:

```bash
  pnpm db:push
```

4. Enable the RLS policy in all tables for security.
5. Set up Supabase auth:

- Navigate to the SQL editor to set up the authentication process.
- Run the following SQL queries in the Supabase SQL editor one by one:

```sql
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER AS $$
  DECLARE
      username_suffix TEXT;
  BEGIN
      -- Generate a random number between 0 and 9999
      SELECT to_char(floor(random() * 10000)::int, 'FM0000') INTO username_suffix;

      -- Inserting into the profiles table
      INSERT INTO public.profiles (id, name, email, profile, username)
      VALUES (NEW.id,
              NEW.raw_user_meta_data ->> 'full_name',
              NEW.email,
              NEW.raw_user_meta_data ->> 'picture',
              lower(regexp_replace(NEW.raw_user_meta_data ->> 'full_name', '\s+', '', 'g')) || username_suffix);

      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

  CREATE OR REPLACE FUNCTION public.handle_user_delete()
  RETURNS TRIGGER AS $$
  BEGIN
    DELETE FROM auth.users WHERE id = old.id;
    RETURN old;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  CREATE OR REPLACE TRIGGER on_profile_user_deleted
  AFTER DELETE ON public.profiles -- replace `profiles` with your profile table name
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_delete();
```

6. Adding Google signup:

Navigate to `/auth/providers` in Supabase, enable Google, and paste the API keys.

### Running the Project

Start the development server:

```bash
  pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Contributing

We welcome contributions from the community. Please follow these steps to contribute:

1. Fork the repository.

2. Create a new branch:

```bash
  git checkout -b feature-branch
```

3. Commit your changes:

```bash
  git commit -m 'Add some feature'
```

4. Push to the branch:

```bash
  git push origin feature-branch
```

5. Open a pull request.

Please make sure your code adheres to our coding standards.

Thank you for contributing to StoryNest! Together, we can build a platform where every story matters and every voice is heard.
