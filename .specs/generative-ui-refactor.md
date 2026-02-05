# Generative UI Refactor

## Overview

This specification outlines a comprehensive refactor of the Generative UI system in the Agno client libraries. The goal is to reduce boilerplate, improve type safety, add missing components, and support multiple UI rendering patterns.

---

## Why This Matters

### The Problem

The current Generative UI implementation has several pain points:

1. **Too Much Boilerplate**: Creating a new tool handler requires 50+ lines of repetitive code for error handling, data transformation, and type casting.

2. **Tight Coupling**: Tool handlers are tightly coupled to specific component structures. If `CardData` shape changes, all handlers using it break.

3. **Missing Renderers**: `Table` and `Markdown` components have type definitions and helper functions, but no actual React renderers.

4. **God Component Anti-Pattern**: `GenerativeUIRenderer.tsx` is a 235-line component with a massive switch statement handling all component types.

5. **String-Based Registry**: The component registry uses string keys with no type safety, making it error-prone.

6. **Limited Flexibility**: Only supports frontend-defined UI. No support for backend/agent-driven UI specifications.

### Industry Context

Modern AI agent frameworks are adopting standardized patterns for rendering dynamic UI:

- **CopilotKit's Generative UI**: Pre-registered components with agent-provided data (Static), JSON specs from backend (A2UI), or full HTML (MCP Apps)
- **MCP-UI Protocol**: Tools link to UI resources via metadata, maximum decoupling between tools and their visual representation

Our library already implements the "Static" pattern but lacks support for more flexible approaches.

---

## What We're Building

### Three UI Patterns

| Pattern | Source | Description | Use Case |
|---------|--------|-------------|----------|
| **Static** | Frontend | Tool handler returns `{ data, ui }` | Full frontend control, type-safe |
| **A2UI** | Backend | Agent returns JSON spec in tool result | Agent decides UI dynamically |
| **Resource** | Hybrid | Tool has `_meta.ui` → fetch UI resource | Maximum decoupling |

### Key Improvements

#### 1. Zod Schemas for Runtime Validation

All UI specs will be validated at runtime using Zod schemas. This provides:
- Runtime type checking (catch invalid specs before they crash)
- TypeScript inference (no manual type definitions)
- Clear error messages when specs are malformed

```typescript
const BarChartSpec = z.object({
  type: z.literal('chart:bar'),
  title: z.string().optional(),
  props: z.object({
    data: z.array(z.record(z.unknown())),
    xKey: z.string(),
    bars: z.array(ChartSeriesSchema),
  }),
});
```

#### 2. Type-Safe Component Registry

Replace string-based registry with a type-safe implementation:

```typescript
// Before: error-prone string keys
registry.register('chart:BarChart', BarChartRenderer);

// After: type-safe with validation
registry.register('chart:bar', BarChartComponent, BarChartSpecSchema);
```

#### 3. Tool Handler Factory

Reduce boilerplate from 50+ lines to ~10 lines:

```typescript
// Before: Manual validation, error handling, transformation
export async function render_sales(args: Record<string, any>) {
  const { query, limit = 10 } = args;
  if (!query) {
    return { data: { error: 'Query required' }, ui: { type: 'markdown', ... } };
  }
  try {
    const data = await fetchSales(query, limit);
    return {
      data,
      ui: {
        type: 'chart',
        component: 'BarChart',
        props: { data, xKey: 'region', bars: [{ key: 'revenue' }] }
      }
    };
  } catch (error) {
    return { data: { error: error.message }, ui: undefined };
  }
}

// After: Declarative, type-safe
const render_sales = createToolHandler({
  args: z.object({ query: z.string(), limit: z.number().default(10) }),
  async execute({ query, limit }) {
    return await fetchSales(query, limit);
  },
  ui: (data) => ({
    type: 'chart:bar',
    title: 'Sales Results',
    props: { data, xKey: 'region', bars: [{ key: 'revenue' }] }
  })
});
```

#### 4. Missing Renderers

Add full implementations for:

- **Table**: Sorting, filtering, pagination, density options, cell formatting
- **Markdown**: Syntax highlighting, code blocks, custom components

#### 5. A2UI Pattern Support

Enable agents to return UI specifications directly from the backend:

```python
# Python backend tool
@tool
def show_analytics(query: str):
    data = fetch_data(query)
    return {
        "data": data,
        "ui": {
            "type": "chart:line",
            "title": "Analytics Dashboard",
            "props": { "data": data, "xKey": "date", ... }
        }
    }
```

The frontend automatically detects and renders the spec.

#### 6. Clean Renderer Architecture

Replace the god component with registry-based lookup:

```typescript
// Before: 235-line switch statement
if (spec.type === 'chart') { ... }
if (spec.type === 'card-grid') { ... }
if (spec.type === 'table') { ... }
// ... many more

// After: Clean registry lookup
const resolved = registry.resolve(spec);
if (!resolved) return <Fallback />;
return <resolved.Component {...resolved.props} />;
```

---

## Architecture

### Package Changes

#### `packages/types/`

```
src/
├── ui.ts              # Current types (keep for backward compat)
├── schemas/           # NEW: Zod schemas
│   ├── index.ts       # Union type + validators
│   ├── base.ts        # Common base schema
│   ├── chart.ts       # Bar, Line, Pie, Area
│   ├── table.ts       # Table with columns
│   ├── card.ts        # Card + CardGrid
│   └── markdown.ts    # Markdown content
```

#### `packages/react/`

```
src/
├── components/
│   ├── GenerativeUIRenderer.tsx  # REFACTOR → registry-based
│   ├── ui/                       # NEW: Pre-built components
│   │   ├── Table.tsx
│   │   ├── Markdown.tsx
│   │   └── index.ts
├── utils/
│   ├── component-registry.ts     # REFACTOR → type-safe
│   ├── ui-helpers.ts             # Keep + enhance
│   └── tool-handler.ts           # NEW: Factory utility
└── hooks/
    └── useAgnoToolExecution.ts   # ENHANCE → A2UI detection
```

---

## Benefits

### For Library Users

- **Less Code**: Write 80% less boilerplate for tool handlers
- **Better Errors**: Zod validation catches issues early with clear messages
- **More Flexibility**: Choose frontend-defined or backend-defined UI per use case
- **Missing Features**: Finally get working Table and Markdown components

### For Library Maintainers

- **Easier Extension**: Adding new component types doesn't require modifying the renderer
- **Type Safety**: Registry catches type mismatches at compile time
- **Testability**: Each component can be tested in isolation
- **Clean Architecture**: Single responsibility, open for extension, closed for modification

### For the Ecosystem

- **Industry Alignment**: Supports patterns used by CopilotKit, MCP-UI, and other agent frameworks
- **Future-Proof**: Resource-based pattern enables advanced use cases (lazy loading, A/B testing)

---

## Migration

This refactor is **non-breaking**. All current code continues to work:

1. Existing `GenerativeUIRenderer` usage unchanged
2. Existing tool handlers unchanged
3. Existing helper functions (`createBarChart`, etc.) unchanged
4. New features are opt-in

Users can gradually adopt:
- New `createToolHandler` factory when writing new handlers
- New Table/Markdown components when needed
- A2UI pattern when backend supports it

---

## References

- [CopilotKit Generative UI](https://github.com/CopilotKit/generative-ui) - Industry patterns for agent-driven UI
- [MCP-UI Protocol](https://github.com/MCP-UI-Org/mcp-ui) - Resource-based UI linking via Model Context Protocol
- [Zod Documentation](https://zod.dev/) - TypeScript-first schema validation

---

## Status

**Branch**: `feat/refactor-gen-ui`
**Status**: Planning Complete
**Next Steps**: Implementation
