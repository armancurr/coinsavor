# Coinsavor

Mobile-first gamified food budgeting app that provides randomized daily meal plans, streak tracking, and monthly spending limits so your broke ass don't get broker. Coinsavor transforms food budgeting into a game. Instead of boring spreadsheets, you get daily meal plans that fit your budget, streak counters that motivate you to stay on track, and spending limits that actually work.

## Features

1. **Randomized Daily Meal Plans**  
Get fresh meal suggestions every day that match your budget and taste preferences.

2. **Streak Tracking**  
Build momentum by staying within budget. Watch your streak grow and develop better spending habits.

3. **Smart Budget Limits**  
Set monthly spending caps with alerts before you overspend.

4. **Gamified Experience**  
Turn budgeting into achievements with progress tracking and milestone rewards.

## Contributing

Want to help make Coinsavor better? Here's how:

1. Fork this repository
2. Create a new branch for your feature
3. Make your changes and test them
4. Submit a pull request with a clear description

We welcome bug fixes, new features, and documentation improvements.

## Installation & Setup

```bash
# Clone the repository
git clone https://github.com/armancurr/coinsavor.git

# Navigate to project directory
cd coinsavor

# Install dependencies
bun install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your database URL

# Setup database
bun run db:migrate
bun run db:seed

# Start the development server
bun dev
```
