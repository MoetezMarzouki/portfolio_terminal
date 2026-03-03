# Terminal Portfolio - Moetez Marzouki

A terminal-inspired portfolio and CV website built with TypeScript and Vite.

## Features

- 🖥️ Terminal-style command-line interface
- ⌨️ Interactive command system (help, about, projects, skills, experience, education, contact, clear)
- 🎨 Multiple terminal themes
- 📱 Fully responsive design
- ♿ Accessibility-compliant (WCAG AA)
- ⚡ Fast and lightweight
- 🧪 Comprehensive test coverage with property-based testing

## Available Commands

- `help` - Display all available commands
- `about` - Show biographical information
- `projects` - List portfolio projects
- `skills` - Display technical skills by category
- `experience` - Show work history
- `education` - Display educational background
- `contact` - Show contact information and social links
- `clear` - Clear the terminal output

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/     # UI components (Terminal, Input, Output)
├── commands/       # Command handlers
├── utils/          # Utility functions (formatter, theme manager)
├── data/           # Static content (content.json)
├── types/          # TypeScript type definitions
└── main.ts         # Application entry point
```

## Customization

To customize the portfolio content, edit `src/data/content.json` with your own information.

## Deployment

This project can be deployed to any static hosting platform:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Push to `gh-pages` branch

## Tech Stack

- TypeScript
- Vite
- Vitest (testing)
- fast-check (property-based testing)
- ESLint + Prettier

## License

MIT
