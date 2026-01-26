import { useState, useEffect, useCallback } from 'react';
import type {
  SessionEntry,
  ChatMessage,
  AgentSessionDetailSchema,
  TeamSessionDetailSchema,
  RunSchema,
  TeamRunSchema,
  CreateSessionRequest,
  UpdateSessionRequest,
} from '@rodrigocoliveira/agno-types';
import { useAgnoClient } from '../context/AgnoContext';

/**
 * Hook for session management
 */
export function useAgnoSession() {
  const client = useAgnoClient();
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(
    client.getConfig().sessionId
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Listen to session events
  useEffect(() => {
    const handleSessionLoaded = (sessionId: string) => {
      setCurrentSessionId(sessionId);
    };

    const handleSessionCreated = (session: SessionEntry) => {
      setSessions((prev) => [session, ...prev]);
      setCurrentSessionId(session.session_id);
    };

    const handleStateChange = () => {
      const config = client.getConfig();
      setCurrentSessionId(config.sessionId);
      setSessions(client.getState().sessions);
    };

    client.on('session:loaded', handleSessionLoaded);
    client.on('session:created', handleSessionCreated);
    client.on('state:change', handleStateChange);

    // Initialize
    setSessions(client.getState().sessions);
    setCurrentSessionId(client.getConfig().sessionId);

    return () => {
      client.off('session:loaded', handleSessionLoaded);
      client.off('session:created', handleSessionCreated);
      client.off('state:change', handleStateChange);
    };
  }, [client]);

  /**
   * Load a specific session
   */
  const loadSession = useCallback(
    async (sessionId: string, options?: { params?: Record<string, string> }): Promise<ChatMessage[]> => {
      setIsLoading(true);
      setError(undefined);
      try {
        const messages = await client.loadSession(sessionId, options);
        setCurrentSessionId(sessionId);
        return messages;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  /**
   * Fetch all sessions
   */
  const fetchSessions = useCallback(async (options?: { params?: Record<string, string> }): Promise<SessionEntry[]> => {
    setIsLoading(true);
    setError(undefined);
    try {
      const fetchedSessions = await client.fetchSessions(options);
      setSessions(fetchedSessions);
      return fetchedSessions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  /**
   * Get a session by ID
   */
  const getSessionById = useCallback(
    async (
      sessionId: string,
      options?: { params?: Record<string, string> }
    ): Promise<AgentSessionDetailSchema | TeamSessionDetailSchema> => {
      setIsLoading(true);
      setError(undefined);
      try {
        return await client.getSessionById(sessionId, options);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  /**
   * Get a run by ID
   */
  const getRunById = useCallback(
    async (
      sessionId: string,
      runId: string,
      options?: { params?: Record<string, string> }
    ): Promise<RunSchema | TeamRunSchema> => {
      setIsLoading(true);
      setError(undefined);
      try {
        return await client.getRunById(sessionId, runId, options);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  /**
   * Create a new session
   */
  const createSession = useCallback(
    async (
      request?: CreateSessionRequest,
      options?: { params?: Record<string, string> }
    ): Promise<AgentSessionDetailSchema | TeamSessionDetailSchema> => {
      setIsLoading(true);
      setError(undefined);
      try {
        const session = await client.createSession(request, options);
        return session;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  /**
   * Update a session
   */
  const updateSession = useCallback(
    async (
      sessionId: string,
      request: UpdateSessionRequest,
      options?: { params?: Record<string, string> }
    ): Promise<AgentSessionDetailSchema | TeamSessionDetailSchema> => {
      setIsLoading(true);
      setError(undefined);
      try {
        return await client.updateSession(sessionId, request, options);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  /**
   * Rename a session
   */
  const renameSession = useCallback(
    async (
      sessionId: string,
      newName: string,
      options?: { params?: Record<string, string> }
    ): Promise<AgentSessionDetailSchema | TeamSessionDetailSchema> => {
      setIsLoading(true);
      setError(undefined);
      try {
        return await client.renameSession(sessionId, newName, options);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  /**
   * Delete a session
   */
  const deleteSession = useCallback(
    async (
      sessionId: string,
      options?: { params?: Record<string, string> }
    ): Promise<void> => {
      setIsLoading(true);
      setError(undefined);
      try {
        await client.deleteSession(sessionId, options);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  /**
   * Delete multiple sessions
   */
  const deleteMultipleSessions = useCallback(
    async (
      sessionIds: string[],
      options?: { params?: Record<string, string> }
    ): Promise<void> => {
      setIsLoading(true);
      setError(undefined);
      try {
        await client.deleteMultipleSessions(sessionIds, options);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  return {
    sessions,
    currentSessionId,
    loadSession,
    fetchSessions,
    getSessionById,
    getRunById,
    createSession,
    updateSession,
    renameSession,
    deleteSession,
    deleteMultipleSessions,
    isLoading,
    error,
  };
}
