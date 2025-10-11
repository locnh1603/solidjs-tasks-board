import { Show, createSignal } from 'solid-js';
import { CircleCheckBig, CircleX } from 'lucide-solid';
import { authActions, authState } from '../../stores/authStore';
import { Button } from '../Shared/Button';
import { Modal } from '../Shared/Modal';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = (props: LoginModalProps) => {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [isSignUp, setIsSignUp] = createSignal(false);
  const [username, setUsername] = createSignal('');
  const [fullName, setFullName] = createSignal('');
  const [localError, setLocalError] = createSignal<string | null>(null);
  const [successMessage, setSuccessMessage] = createSignal<string | null>(null);

  const validateEmail = (input: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const validatePassword = (input: string): boolean => input.length >= 6;

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    if (!validateEmail(email())) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password())) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (isSignUp() && !username().trim()) {
      setLocalError('Username is required');
      return;
    }

    try {
      if (isSignUp()) {
        const { error } = await authActions.signUp(
          email(),
          password(),
          username(),
          fullName() || undefined
        );

        if (error) {
          setLocalError(error);
        } else {
          setSuccessMessage('Account created! Please check your email to verify your account.');
          // Reset form
          setEmail('');
          setPassword('');
          setUsername('');
          setFullName('');
          setIsSignUp(false);
        }
      } else {
        const { error } = await authActions.signIn(email(), password());

        if (error) {
          setLocalError(error);
        } else {
          // Close modal on successful login
          props.onClose();
        }
      }
    } catch (error) {
      setLocalError('An unexpected error occurred. Please try again.');
      console.error('Auth error:', error);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp());
    setLocalError(null);
    setSuccessMessage(null);
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="md" showCloseButton={true}>
      <div class="space-y-6">
        <div>
          <h2 class="text-center [font-size:var(--font-size-2xl)] [font-weight:var(--font-weight-bold)] [color:var(--text-base)]">
            {isSignUp() ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p class="mt-2 text-center [font-size:var(--font-size-sm)] [color:var(--text-muted)]">
            {isSignUp() ? 'Already have an account? ' : "Don't have an account? "}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMode}
              class="!inline !p-0 !h-auto [font-weight:var(--font-weight-medium)] [color:var(--text-primary-on-light)] hover:[color:var(--text-primary-on-light-hover)] hover:bg-transparent underline"
            >
              {isSignUp() ? 'Sign in' : 'Sign up'}
            </Button>
          </p>
        </div>

        {/* Error Message */}
        <Show when={localError() ?? authState.error}>
          <div class="[border-radius:var(--radius-md)] bg-error-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <CircleX class="h-5 w-5 text-error-400" />
              </div>
              <div class="ml-3">
                <p class="[font-size:var(--font-size-sm)] [font-weight:var(--font-weight-medium)] [color:var(--text-error-on-light)]">
                  {localError() ?? authState.error}
                </p>
              </div>
            </div>
          </div>
        </Show>

        {/* Success Message */}
        <Show when={successMessage()}>
          <div class="[border-radius:var(--radius-md)] bg-success-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <CircleCheckBig class="h-5 w-5 text-success-400" />
              </div>
              <div class="ml-3">
                <p class="[font-size:var(--font-size-sm)] [font-weight:var(--font-weight-medium)] [color:var(--text-success-on-light)]">
                  {successMessage()}
                </p>
              </div>
            </div>
          </div>
        </Show>

        <form
          class="space-y-4"
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
        >
          <div class="space-y-4">
            {/* Email Field */}
            <div>
              <label
                for="email"
                class="block [font-size:var(--font-size-sm)] [font-weight:var(--font-weight-medium)] [color:var(--text-base)] mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                class="appearance-none relative block w-full px-3 py-2 border border-neutral-300 [color:var(--text-base)] [border-radius:var(--radius-lg)] placeholder:[color:var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 [font-size:var(--font-size-sm)]"
                placeholder="you@example.com"
                disabled={authState.loading}
              />
            </div>

            {/* Username Field (Sign Up only) */}
            <Show when={isSignUp()}>
              <div>
                <label
                  for="username"
                  class="block [font-size:var(--font-size-sm)] [font-weight:var(--font-weight-medium)] [color:var(--text-base)] mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autocomplete="username"
                  required
                  value={username()}
                  onInput={(e) => setUsername(e.currentTarget.value)}
                  class="appearance-none relative block w-full px-3 py-2 border border-neutral-300 [color:var(--text-base)] [border-radius:var(--radius-lg)] placeholder:[color:var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 [font-size:var(--font-size-sm)]"
                  placeholder="johndoe"
                  disabled={authState.loading}
                />
              </div>
            </Show>

            {/* Full Name Field (Sign Up only, optional) */}
            <Show when={isSignUp()}>
              <div>
                <label
                  for="fullName"
                  class="block [font-size:var(--font-size-sm)] [font-weight:var(--font-weight-medium)] [color:var(--text-base)] mb-1"
                >
                  Full Name (Optional)
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autocomplete="name"
                  value={fullName()}
                  onInput={(e) => setFullName(e.currentTarget.value)}
                  class="appearance-none relative block w-full px-3 py-2 border border-neutral-300 [color:var(--text-base)] [border-radius:var(--radius-lg)] placeholder:[color:var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 [font-size:var(--font-size-sm)]"
                  placeholder="John Doe"
                  disabled={authState.loading}
                />
              </div>
            </Show>

            {/* Password Field */}
            <div>
              <label
                for="password"
                class="block [font-size:var(--font-size-sm)] [font-weight:var(--font-weight-medium)] [color:var(--text-base)] mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete={isSignUp() ? 'new-password' : 'current-password'}
                required
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                class="appearance-none relative block w-full px-3 py-2 border border-neutral-300 [color:var(--text-base)] [border-radius:var(--radius-lg)] placeholder:[color:var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 [font-size:var(--font-size-sm)]"
                placeholder={isSignUp() ? 'At least 6 characters' : ''}
                disabled={authState.loading}
              />
            </div>
          </div>

          {/* Remember me / Forgot password (Sign In only) */}
          <Show when={!isSignUp()}>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 [border-radius:var(--radius-sm)]"
                />
                <label
                  for="remember-me"
                  class="ml-2 block [font-size:var(--font-size-sm)] [color:var(--text-base)]"
                >
                  Remember me
                </label>
              </div>

              <div class="[font-size:var(--font-size-sm)]">
                <a
                  href="#"
                  class="[font-weight:var(--font-weight-medium)] [color:var(--text-primary-on-light)] hover:[color:var(--text-primary-on-light-hover)]"
                >
                  Forgot password?
                </a>
              </div>
            </div>
          </Show>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              disabled={authState.loading}
              loading={authState.loading}
            >
              {isSignUp() ? 'Create Account' : 'Sign In'}
            </Button>
          </div>
        </form>

        {/* Additional Info */}
        <div class="text-center [font-size:var(--font-size-xs)] [color:var(--text-subtle)]">
          <p>
            By {isSignUp() ? 'creating an account' : 'signing in'}, you agree to our{' '}
            <a
              href="#"
              class="[color:var(--text-primary-on-light)] hover:[color:var(--text-primary-on-light-hover)]"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="#"
              class="[color:var(--text-primary-on-light)] hover:[color:var(--text-primary-on-light-hover)]"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </Modal>
  );
};
