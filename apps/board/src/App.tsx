import { Show } from 'solid-js';
import { authActions, authState } from './stores/authStore';
import { LoginForm } from './components/Auth/LoginForm';
import './App.css';

function App() {
  return (
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
      <Show when={authState.user} fallback={<LoginForm />}>
        <div class="min-h-screen bg-gray-50">
          {/* Header */}
          <header class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Task Board</h1>
                <p class="text-sm text-gray-600 mt-1">
                  Welcome, {authState.profile?.full_name ?? authState.user?.email}
                </p>
              </div>
              <button
                onClick={() => void authActions.signOut()}
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="bg-white rounded-xl shadow-md p-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">
                🎉 Successfully Authenticated!
              </h2>
              <div class="space-y-2 text-gray-700">
                <p>
                  <span class="font-medium">Email:</span> {authState.user?.email}
                </p>
                <Show when={authState.profile?.username}>
                  <p>
                    <span class="font-medium">Username:</span> {authState.profile?.username}
                  </p>
                </Show>
                <Show when={authState.profile?.full_name}>
                  <p>
                    <span class="font-medium">Full Name:</span> {authState.profile?.full_name}
                  </p>
                </Show>
                <p class="text-sm text-gray-500 mt-4">
                  This is your authenticated dashboard. The full task board functionality will be
                  integrated here.
                </p>
              </div>
            </div>
          </main>
        </div>
      </Show>
    </Show>
  );
}

export default App;
