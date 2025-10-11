import { type JSX, ErrorBoundary as SolidErrorBoundary } from 'solid-js';
import { Button } from '../Shared/Button';
import { CircleAlert } from 'lucide-solid';

interface ErrorBoundaryProps {
  children: JSX.Element;
}

export const ErrorBoundary = (props: ErrorBoundaryProps) => (
  <SolidErrorBoundary
    fallback={(err, reset) => (
      <div class="min-h-screen flex items-center justify-center bg-[rgb(var(--color-error-50))] px-4">
        <div class="max-w-md w-full bg-[rgb(var(--color-error-100))] rounded-2xl shadow-2xl p-8">
          <div class="text-center">
            <div class="inline-block p-4 bg-[rgb(var(--color-error-100))] rounded-full mb-4">
              <CircleAlert class="w-16 h-16 text-[rgb(var(--color-error-600))]" />
            </div>
            <h2 class="text-2xl font-bold text-[rgb(var(--color-error-900))] mb-2">
              Oops! Something went wrong
            </h2>
            <p class="text-[rgb(var(--color-error-800))] mb-6">
              An unexpected error occurred. Please try again or contact support if the problem
              persists.
            </p>
            <div class="bg-[rgb(var(--color-error-50))] rounded-lg p-4 mb-6 text-left">
              <p class="text-sm font-mono text-[rgb(var(--color-error-700))] break-all">
                {err.toString()}
              </p>
            </div>
            <Button
              onClick={reset}
              variant="danger"
              fullWidth
              size="md"
              class="bg-[rgb(var(--color-error-600))] hover:bg-[rgb(var(--color-error-700))] active:bg-[rgb(var(--color-error-800))] text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )}
    {...props}
  />
);
