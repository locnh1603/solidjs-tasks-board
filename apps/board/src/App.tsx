import { Show, onCleanup, onMount } from 'solid-js';
import { ErrorBoundary } from './components/Layout/ErrorBoundary';
import { authState, initAuth } from './stores/authStore';
import { MainLayout } from './components/Layout/MainLayout';

function App() {
  // Initialize auth on mount
  onMount(() => {
    const cleanup = initAuth();

    onCleanup(() => {
      cleanup();
    });
  });

  // Fallback: If initialization takes too long, retry
  onMount(() => {
    const timeout = setTimeout(() => {
      if (!authState.initialized) {
        console.warn('[App] Auth initialization timeout, retrying...');
        initAuth();
      }
    }, 5000);

    return () => clearTimeout(timeout);
  });

  return (
    <ErrorBoundary>
      <Show
        when={authState.initialized}
        fallback={
          <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div class="text-center">
              <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600" />
              <p class="mt-4 text-lg text-gray-700 font-medium">Loading...</p>
            </div>
          </div>
        }
      >
        <MainLayout />
      </Show>
    </ErrorBoundary>
  );
}

export default App;
