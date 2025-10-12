import { type JSX, ErrorBoundary as SolidErrorBoundary } from 'solid-js';
import { Button } from '../Shared/Button';
import { CircleAlert } from 'lucide-solid';
import styles from '../../styles/layouts/ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: JSX.Element;
}

export const ErrorBoundary = (props: ErrorBoundaryProps) => (
  <SolidErrorBoundary
    fallback={(err, reset) => (
      <div class={styles.container}>
        <div class={styles.errorCard}>
          <div class={styles.content}>
            <div class={styles.iconCircle}>
              <CircleAlert class={styles.icon} />
            </div>
            <h2 class={styles.title}>Oops! Something went wrong</h2>
            <p class={styles.message}>
              An unexpected error occurred. Please try again or contact support if the problem
              persists.
            </p>
            <div class={styles.errorBox}>
              <p class={styles.errorText}>{err.toString()}</p>
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
