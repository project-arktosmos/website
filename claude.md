# Claude Development Guide - Arktosmos Website

## Project Overview

SvelteKit 5 static site using Tailwind CSS v4 with DaisyUI, TypeScript, and Vitest for testing. Deployed as a single-page application via `@sveltejs/adapter-static`.

## Architecture: Three-Layer Separation

```
Component (UI) → Adapter (logic) → Service (persistence)
```

### 1. Components (`/src/components`)
- **Purpose**: UI rendering only - keep logic-free
- **Responsibilities**: Display state, emit events, handle user interactions
- **DO NOT**: Contain business logic, directly access localStorage, manage complex state

### 2. Adapters (`/src/adapters`)
- **Purpose**: Non-persisted business logic
- **Responsibilities**: Data transformation, validation, formatting, computations
- **Base Class**: `AdapterClass` with ID pattern `adapter:{name}`
- **DO NOT**: Persist data, manage stores

### 3. Services (`/src/services`)
- **Purpose**: Persisted state management
- **Responsibilities**: localStorage persistence, Svelte store management, CRUD operations
- **Classes**:
  - `ArrayServiceClass<T>` - for collections (items must have `id: ID`)
  - `ObjectServiceClass<T>` - for single objects (must have `id: ID`)
- **ID Patterns**: `array-service:{name}`, `object-service:{name}`

## Path Aliases

```typescript
$components  → src/components/*
$utils       → src/utils/*
$types       → src/types/*
$data        → src/data/*
$adapters    → src/adapters/*
$services    → src/services/*
```

## Component Conventions

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import classNames from 'classnames';

  // Props with defaults
  export let label: string = '';
  export let disabled: boolean = false;

  // Event dispatcher for custom events
  const dispatch = createEventDispatcher();

  // Reactive class computation using classnames package
  $: buttonClass = classNames('btn', {
    'btn-disabled': disabled,
    'btn-primary': !disabled
  });
</script>

<!-- Minimal template logic, NO <style> tags -->
<button class={buttonClass} on:click={() => dispatch('click')}>
  {label}
</button>
```

**Rules**:
- Use `<script lang="ts">` for TypeScript
- Export props with sensible defaults
- Use `createEventDispatcher()` for custom events
- Use `$:` for reactive statements
- Keep template logic minimal

## Styling Rules

**IMPORTANT**: All styling must use Tailwind CSS classes. Never use `<style>` tags.

```svelte
<!-- CORRECT: Tailwind classes with classnames for logic -->
<script lang="ts">
  import classNames from 'classnames';

  export let isActive: boolean = false;
  export let size: 'sm' | 'md' | 'lg' = 'md';

  $: containerClass = classNames(
    'flex items-center rounded-lg transition-colors',
    {
      'bg-primary text-white': isActive,
      'bg-base-200 text-base-content': !isActive,
      'p-2 text-sm': size === 'sm',
      'p-4 text-base': size === 'md',
      'p-6 text-lg': size === 'lg'
    }
  );
</script>

<div class={containerClass}>
  <slot />
</div>

<!-- WRONG: Never do this -->
<style>
  .container { display: flex; }
</style>
```

**Styling Guidelines**:
- Use Tailwind CSS utility classes exclusively
- Use `classnames` npm package for conditional class logic
- Use DaisyUI component classes (`btn`, `card`, `modal`, etc.)
- Use theme colors via DaisyUI (`bg-primary`, `text-secondary`, etc.)
- Never write custom CSS in `<style>` tags
- Never use inline styles unless absolutely necessary

## Service Usage

```typescript
// Creating a service
import { ArrayServiceClass } from '$services/classes/array-service.class';

interface User { id: string; name: string; }

const userService = new ArrayServiceClass<User>('users');

// Operations
userService.add({ id: '1', name: 'Alice' });
userService.update({ id: '1', name: 'Alice Updated' });
userService.remove({ id: '1' });
userService.exists('1');  // Returns item or null
userService.all();        // Returns all items
userService.find(u => u.name === 'Alice');
userService.filter(u => u.name.startsWith('A'));

// Subscribe to store in components
$: users = $userService.store;
```

## Adapter Usage

```typescript
// Creating an adapter
import { AdapterClass } from '$adapters/classes/adapter.class';

class UserAdapter extends AdapterClass {
  constructor() {
    super('user');
  }

  formatDisplayName(user: User): string {
    return user.name.toUpperCase();
  }

  validateUser(user: User): boolean {
    return user.name.length > 0;
  }
}
```

## Type Definitions

```typescript
// ID type for all entities
type ID = string | number;

// Theme enums from $types/core.type
enum ThemeColors { Primary, Secondary, Accent, Success, Error, Info, Warning, Neutral }
enum ThemeSizes { XSmall = 'xs', Small = 'sm', Medium = 'md', Large = 'lg', XLarge = 'xl' }
```

**Rule**: All service-managed entities must have `id: ID` property.

## File Naming

- Components: `PascalCase.svelte` (e.g., `Button.svelte`)
- Classes: `kebab-case.class.ts` (e.g., `array-service.class.ts`)
- Types: `kebab-case.type.ts` (e.g., `core.type.ts`)
- Utilities: `camelCase.ts` (e.g., `capitalize.ts`)
- Tests: `*.test.ts` mirroring source structure

## Directory Structure

```
/src
├── /adapters/classes     - Adapter class definitions
├── /components/core      - Reusable UI components
├── /css                  - Global styles (Tailwind/DaisyUI)
├── /routes               - SvelteKit pages
├── /services/classes     - Service class definitions
├── /types                - TypeScript type definitions
└── /utils                - Helper functions

/test
├── /adapters             - Adapter tests
├── /services             - Service tests
├── /utils                - Utility tests
└── /mocks                - Test mocks
```

## Testing

```typescript
// Test structure
describe('ServiceName', () => {
  let service: ArrayServiceClass<TestItem>;

  beforeEach(() => {
    localStorage.clear();
    service = new ArrayServiceClass<TestItem>('test');
  });

  it('should add items', () => {
    const item = { id: '1', value: 'test' };
    service.add(item);
    expect(service.exists('1')).toEqual(item);
  });
});
```

**Test Helpers** (`test/utils/test-helpers.ts`):
- `createMockItem<T>(id, data)` - create test objects
- `createMockItems<T>(count, baseData)` - batch creation
- `getLocalStorageItem<T>(key)` - retrieve from localStorage
- `setLocalStorageItem<T>(key, value)` - store to localStorage

## Commands

```bash
npm run dev        # Development server
npm run build      # Production build to /dist
npm run test       # Run tests
npm run test:ui    # Tests with UI
npm run check      # TypeScript check
npm run lint       # ESLint
npm run format     # Prettier
```

## Key Principles

1. **Components are logic-free**: Only render UI and emit events
2. **Adapters handle non-persisted logic**: Transformations, validations, computations
3. **Services handle persistence**: localStorage, store management, CRUD
4. **All entities need `id: ID`**: Required for service operations
5. **Use path aliases**: Cleaner imports with `$components`, `$services`, etc.
6. **Keep it simple**: Avoid over-engineering, no unnecessary abstractions
