# Documentation

This section contains the technical documentation for Project Arktosmos.

## Architecture

The project follows a three-layer separation pattern:

1. **Components** - UI rendering only
2. **Adapters** - Business logic without persistence
3. **Services** - State management with persistence

## Technology Stack

- SvelteKit 5
- Tailwind CSS v4
- DaisyUI
- TypeScript
- Vitest

## Development

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run test   # Run tests
```
