# Coinsavor

Mobile-first gamified food budgeting that keeps your wallet happy. Coinsavor transforms the mundane task of food budgeting into an engaging, game-like experience. Built with a mobile-first approach, this application delivers randomized daily meal plans while maintaining strict spending limits through streak tracking and gamification mechanics.

## Key Features

### Intelligent Meal Planning
Randomized daily meal suggestions that adapt to your budget constraints and dietary preferences, ensuring variety without financial strain.

### Streak Tracking System
Build momentum with consecutive days of staying within budget. Watch your streaks grow as you develop sustainable spending habits.

### Monthly Budget Management
Set realistic monthly spending limits with intelligent alerts and recommendations to prevent budget overruns before they happen.

### Gamification Engine
Transform budgeting from a chore into an achievement system with progress tracking, milestone rewards, and visual feedback.

## Installation

### Setup Process
```bash
# Clone the repository
git clone https://github.com/armancurr/coinsavor.git

# Navigate to project directory
cd coinsavor

# Install dependencies
bun install

# Start local server
bun dev
```

## Configuration

### Environment Variables
Create a `.env.local` file in the root directory:
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/coinsavor
```

### Database Setup
```bash
# Run migrations
bun run db:migrate

# Seed initial data
bun run db:seed
```

### Build Process
```bash
# Development build
bun run build:dev

# Production build
bun run build:prod
```

## Contributing

### Development Guidelines
1. Fork the repository and create feature branches
2. Follow conventional commit message format
3. Ensure test coverage for new functionality
4. Submit pull requests with detailed descriptions

## License

MIT License - see [LICENSE.md](LICENSE.md) for complete terms and conditions.
