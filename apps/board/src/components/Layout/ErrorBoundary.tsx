import { type JSX, ErrorBoundary as SolidErrorBoundary } from 'solid-js';
import { Button } from '../Shared/Button';
import { CircleAlert } from 'lucide-solid';

interface ErrorBoundaryProps {
  children: JSX.Element;
}

export const ErrorBoundary = (props: ErrorBoundaryProps) => (
  <SolidErrorBoundary
    fallback={(err, reset) => (
      <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 px-4">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div class="text-center">
            <div class="inline-block p-4 bg-red-100 rounded-full mb-4">
              <CircleAlert class="w-16 h-16 text-red-600" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p class="text-gray-600 mb-6">
              An unexpected error occurred. Please try again or contact support if the problem
              persists.
            </p>
            <div class="bg-red-50 rounded-lg p-4 mb-6 text-left">
              <p class="text-sm font-mono text-red-800 break-all">{err.toString()}</p>
            </div>
            <Button onClick={reset} variant="danger" fullWidth size="md">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )}
    {...props}
  />
);
