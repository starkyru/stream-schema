import React, { createContext, useContext } from 'react';
import type { StreamStatus } from '@stream-schema/core';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface StreamStatusContextValue {
  status: StreamStatus;
}

const StreamStatusContext = createContext<StreamStatusContextValue>({
  status: 'idle',
});

export interface StreamStatusProviderProps {
  status: StreamStatus;
  children: React.ReactNode;
}

/**
 * Provides stream status to a subtree.
 * Wrap your streaming UI in this so deeply nested components can react to state.
 *
 * @example
 * <StreamStatusProvider status={status}>
 *   <MyCard />           // can call useStreamStatus() anywhere in here
 *   <StreamStatus>...</StreamStatus>
 * </StreamStatusProvider>
 */
export function StreamStatusProvider({ status, children }: StreamStatusProviderProps) {
  return (
    <StreamStatusContext.Provider value={{ status }}>
      {children}
    </StreamStatusContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface StreamStatusState {
  status: StreamStatus;
  isIdle: boolean;
  isStreaming: boolean;
  isComplete: boolean;
  isError: boolean;
}

/** Consume stream status from context. Must be inside StreamStatusProvider. */
export function useStreamStatus(): StreamStatusState {
  const { status } = useContext(StreamStatusContext);
  return {
    status,
    isIdle: status === 'idle',
    isStreaming: status === 'streaming',
    isComplete: status === 'complete',
    isError: status === 'error',
  };
}

// ---------------------------------------------------------------------------
// Render prop component
// ---------------------------------------------------------------------------

export interface StreamStatusProps {
  /** Render prop - receives full status state. */
  children: (state: StreamStatusState) => React.ReactNode;
}

/**
 * Render prop component for consuming stream status from context.
 * Alternative to useStreamStatus() for non-hook usage.
 *
 * @example
 * <StreamStatus>
 *   {({ isStreaming }) => isStreaming && <Spinner />}
 * </StreamStatus>
 */
export function StreamStatus({ children }: StreamStatusProps) {
  const state = useStreamStatus();
  return <>{children(state)}</>;
}
