import { createSignal } from 'solid-js';
import { authActions, authState } from '../../stores/authStore';

export const LoginForm = () => {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [isSignUp, setIsSignUp] = createSignal(false);
  const [username, setUsername] = createSignal('');
  const [fullName, setFullName] = createSignal('');
  const [localError, setLocalError] = createSignal<string | null>(null);
  const [successMessage, setSuccessMessage] = createSignal<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    // Validation
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
          fullName() || undefined,
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
        }
        // On success, auth state will update automatically
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
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl">
        <div>
          <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp() ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            {isSignUp() ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={toggleMode}
              class="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition"
            >
              {isSignUp() ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>

        {/* Error Message */}
        {(localError() || authState.error) && (
          <div class="rounded-md bg-red-50 p-4 animate-fadeIn">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">{localError() || authState.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage() && (
          <div class="rounded-md bg-green-50 p-4 animate-fadeIn">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">{successMessage()}</p>
              </div>
            </div>
          </div>
        )}

        <form class="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div class="rounded-md shadow-sm space-y-4">
            {/* Email Field */}
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
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
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition"
                placeholder="you@example.com"
                disabled={authState.loading}
              />
            </div>

            {/* Username Field (Sign Up only) */}
            {isSignUp() && (
              <div>
                <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
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
                  class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition"
                  placeholder="johndoe"
                  disabled={authState.loading}
                />
              </div>
            )}

            {/* Full Name Field (Sign Up only, optional) */}
            {isSignUp() && (
              <div>
                <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
                  Full Name (Optional)
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autocomplete="name"
                  value={fullName()}
                  onInput={(e) => setFullName(e.currentTarget.value)}
                  class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition"
                  placeholder="John Doe"
                  disabled={authState.loading}
                />
              </div>
            )}

            {/* Password Field */}
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
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
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition"
                placeholder={isSignUp() ? 'At least 6 characters' : ''}
                disabled={authState.loading}
              />
            </div>
          </div>

          {/* Remember me / Forgot password (Sign In only) */}
          {!isSignUp() && (
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div class="text-sm">
                <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500 transition">
                  Forgot password?
                </a>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={authState.loading}
              class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {authState.loading ? (
                <span class="flex items-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                <span>{isSignUp() ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </div>
        </form>

        {/* Additional Info */}
        <div class="text-center text-xs text-gray-500 mt-4">
          <p>
            By {isSignUp() ? 'creating an account' : 'signing in'}, you agree to our{' '}
            <a href="#" class="text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" class="text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
