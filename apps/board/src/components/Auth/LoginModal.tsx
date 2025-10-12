import { Show, createSignal } from 'solid-js';
import { CircleCheckBig, CircleX } from 'lucide-solid';
import { authActions, authState } from '../../stores/authStore';
import { Button } from '../Shared/Button';
import { Modal } from '../Shared/Modal';
import { Input } from '../Shared/Input';
import { Checkbox } from '../Shared/Checkbox';
import styles from '../../styles/components/LoginModal.module.css';
import { classList } from '../../utils/classList';

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
      <div class={styles.content}>
        <div class={styles.header}>
          <h2 class={styles.title}>
            {isSignUp() ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p class={styles.subtitle}>
            {isSignUp() ? 'Already have an account? ' : "Don't have an account? "}
            <Button variant="link" onClick={toggleMode}>
              {isSignUp() ? 'Sign in' : 'Sign up'}
            </Button>
          </p>
        </div>

        {/* Error Message */}
        <Show when={localError() ?? authState.error}>
          <div class={classList(styles.alert, styles.alertError)}>
            <div class={styles.alertIcon}>
              <CircleX class={styles.alertIconError} />
            </div>
            <div class={styles.alertContent}>
              <p class={classList(styles.alertText, styles.alertTextError)}>
                {localError() ?? authState.error}
              </p>
            </div>
          </div>
        </Show>

        {/* Success Message */}
        <Show when={successMessage()}>
          <div class={classList(styles.alert, styles.alertSuccess)}>
            <div class={styles.alertIcon}>
              <CircleCheckBig class={styles.alertIconSuccess} />
            </div>
            <div class={styles.alertContent}>
              <p class={classList(styles.alertText, styles.alertTextSuccess)}>{successMessage()}</p>
            </div>
          </div>
        </Show>

        <form
          class={styles.form}
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
        >
          <div class={styles.formFields}>
            {/* Email Field */}
            <Input
              id="email"
              name="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              autocomplete="email"
              required
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              disabled={authState.loading}
            />

            {/* Username Field (Sign Up only) */}
            <Show when={isSignUp()}>
              <Input
                id="username"
                name="username"
                type="text"
                label="Username"
                placeholder="johndoe"
                autocomplete="username"
                required
                value={username()}
                onInput={(e) => setUsername(e.currentTarget.value)}
                disabled={authState.loading}
              />
            </Show>

            {/* Full Name Field (Sign Up only, optional) */}
            <Show when={isSignUp()}>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                label="Full Name (Optional)"
                placeholder="John Doe"
                autocomplete="name"
                value={fullName()}
                onInput={(e) => setFullName(e.currentTarget.value)}
                disabled={authState.loading}
              />
            </Show>

            {/* Password Field */}
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder={isSignUp() ? 'At least 6 characters' : ''}
              autocomplete={isSignUp() ? 'new-password' : 'current-password'}
              required
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              disabled={authState.loading}
            />
          </div>

          {/* Remember me / Forgot password (Sign In only) */}
          <Show when={!isSignUp()}>
            <div class={styles.rememberRow}>
              <Checkbox
                id="remember-me"
                name="remember-me"
                label="Remember me"
                disabled={authState.loading}
              />

              <div class={styles.forgotPassword}>
                <a href="#" class="app-link">
                  Forgot password?
                </a>
              </div>
            </div>
          </Show>

          {/* Submit Button */}
          <div class={styles.submitContainer}>
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
        <div class={styles.footer}>
          <p>
            By {isSignUp() ? 'creating an account' : 'signing in'}, you agree to our{' '}
            <a href="#" class="app-link">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" class="app-link">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </Modal>
  );
};
