# SupaDnd - A Text-Based Adventure Game

## Overview
This is a text-based adventure game, inspired by Dungeons & Dragons and [Pen Apple](https://example.com/pen-apple-link). The game leverages AI embeddings, such as GPT-4, to dynamically generate and interpret in-game content like storylines, enemies, stats, items, and more. Instead of using pre-programmed logic, natural language descriptions serve as the "ground truth," offering a more flexible and immersive gameplay experience.

The game is created using:
- [Supabase](https://supabase.com) - Database and user authentication.
- [Next.js](https://nextjs.org) - Frontend framework.
- [Vercel](https://vercel.com) - Hosting platform.

## Features
- AI-driven storyline and content generation.
- Dynamic interpretation of gameplay elements, such as enemies, items, and stats.
- Fully text-based, focused on imagination and strategy.

## How It Works
_TBD_

## Self-Host
### Prerequisites
Make sure you have the following tools installed:
- Node.js
- Supabase CLI
- Git

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```

2. Install dependencies:
    ```bash
    cd your-repo-name
    npm install
    ```

3. Set up Supabase & OpenAI:
    - [Create a Supabase account](https://supabase.com) and initialize your project.
    - Set up your Supabase keys in a `.env.local` file:
      ```
      NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
      NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

      DATABASE_URL=your-supabase-db-url

      OPENAI_API_KEY=you-openai-key
      ```

4. Run the development server:
    ```bash
    npm run dev
    ```

### Deployment
This project is deployed using [Vercel](https://vercel.com). You can deploy it directly by connecting your GitHub repository to Vercel and following their deployment process.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.