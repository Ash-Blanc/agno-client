# @rodrigocoliveira/agno-vue

Vue 3 Composition API integration for agno-client with full TypeScript support.

## Installation

### npm

```bash
npm install @rodrigocoliveira/agno-vue @rodrigocoliveira/agno-client vue
```

### pnpm

```bash
pnpm add @rodrigocoliveira/agno-vue @rodrigocoliveira/agno-client vue
```

### Bun

```bash
bun add @rodrigocoliveira/agno-vue @rodrigocoliveira/agno-client vue
```

## Quick Start

### Basic Setup

```vue
<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(msg, idx) in messages" :key="idx" class="message">
        <strong>{{ msg.role }}:</strong> {{ msg.content }}
      </div>
    </div>
    <button @click="sendMessage('Hello!')" :disabled="isStreaming">
      Send
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAgnoChat } from '@rodrigocoliveira/agno-vue'
import { AgnoProvider } from '@rodrigocoliveira/agno-vue'

const { messages, sendMessage, isStreaming } = useAgnoChat()
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.messages {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.message {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>
```

### Wrap with AgnoProvider

```vue
<template>
  <AgnoProvider :config="agnoConfig">
    <YourChatComponent />
  </AgnoProvider>
</template>

<script setup lang="ts">
import { AgnoProvider } from '@rodrigocoliveira/agno-vue'
import YourChatComponent from './YourChatComponent.vue'

const agnoConfig = {
  endpoint: 'http://localhost:7777',
  mode: 'agent',
  agentId: 'your-agent-id',
  userId: 'user-123',
  authToken: 'your-token',
  onTokenExpired: async () => {
    // Refresh token logic
    const response = await fetch('/api/refresh-token')
    const { token } = await response.json()
    return token
  },
}
</script>
```

## Composables

### useAgnoChat

Manage chat messages and streaming.

```typescript
const { messages, sendMessage, isStreaming, clearMessages } = useAgnoChat()

// Properties
messages.value // Ref<Message[]>
isStreaming.value // Ref<boolean>

// Methods
await sendMessage('Your message')
clearMessages()
```

### useAgnoActions

Initialize and manage agent actions.

```typescript
const { initialize, isInitialized, config } = useAgnoActions()

// Properties
isInitialized.value // Ref<boolean>
config.value // Ref<Config>

// Methods
await initialize()
```

### useAgnoToolExecution

Handle frontend tool execution.

```typescript
const toolHandlers = {
  navigate_to_page: async (args: { url: string }) => {
    window.location.href = args.url
    return { success: true }
  },
  get_location: async () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      })
    })
  },
}

const { isPaused, isExecuting, pendingTools, resumeExecution, pauseExecution } =
  useAgnoToolExecution(toolHandlers)
```

## Types

Full TypeScript support with exported types:

```typescript
import type {
  Message,
  Config,
  Tool,
  ToolHandler,
  AgnoVueConfig,
} from '@rodrigocoliveira/agno-vue'
```

## Performance Tips

1. **Use Bun** - Get 10-25x faster dependency installation
2. **Memoize callbacks** - Use `useCallback` equivalent patterns
3. **Lazy load** - Split chat components with `<Suspense>`
4. **Debounce messages** - Rate-limit message sending

## Troubleshooting

### Messages not updating

Ensure your component is properly wrapped in `AgnoProvider`.

### Type errors

Make sure TypeScript version is 5.3+:

```bash
pnpm add -D typescript@latest
```

## Examples

See `examples/vue-basic/` and `examples/vue-advanced/` for complete examples.

## License

MIT
