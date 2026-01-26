import { useState, useEffect, useCallback, useRef } from 'react';
import type { CustomEventData } from '@rodrigocoliveira/agno-types';
import { useAgnoClient } from '../context/AgnoContext';

/**
 * React hook to subscribe to custom events emitted by the agent backend (yielding CustomEventData).
 *
 * Custom events are emitted when agent yeilds data not directly related to tool execution or chat messages,
 * through the CustomEvent API event type.
 *
 * @param handler - Optional callback invoked for each custom event
 * @returns Object containing accumulated custom events and a clear function
 *
 * @example
 * // Collect all custom events
 * const { events } = useAgnoCustomEvents();
 *
 * @example
 * // Handle events as they arrive
 * const { events } = useAgnoCustomEvents((event) => {
 *   if (event.greeting) {
 *     showToast(event.greeting);
 *   }
 * });
 *
 * @example
 * // Filter for specific event types
 * const { events } = useAgnoCustomEvents();
 * const greetings = events.filter(e => 'greeting' in e);
 *
 * @example
 * // Clear accumulated events
 * const { events, clearEvents } = useAgnoCustomEvents();
 * // Later...
 * clearEvents();
 */
export function useAgnoCustomEvents(
  handler?: (event: CustomEventData) => void
): {
  events: CustomEventData[];
  clearEvents: () => void;
} {
  const client = useAgnoClient();
  const [events, setEvents] = useState<CustomEventData[]>([]);

  // Use ref to avoid stale closure issues with the handler
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const handleCustomEvent = (event: CustomEventData) => {
      setEvents((prev) => [...prev, event]);
      handlerRef.current?.(event);
    };

    client.on('custom:event', handleCustomEvent);

    return () => {
      client.off('custom:event', handleCustomEvent);
    };
  }, [client]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return { events, clearEvents };
}
