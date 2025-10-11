import { Show, createSignal } from 'solid-js';
import { FileText } from 'lucide-solid';
import { authState } from '../../stores/authStore';
import { Header } from './Header';
import { LoginModal } from '../Auth/LoginModal';
import { BoardView } from '../Board/BoardView';
import { ChatWidget } from '../Chat/ChatWidget';
import { PresenceWidget } from '../Presence/PresenceWidget';

export const MainLayout = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = createSignal(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <Header onLoginClick={openLoginModal} />

      {/* Main Content */}
      <main class="flex-1 flex flex-col">
        <Show
          when={authState.user}
          fallback={
            <div class="flex-1 flex items-center justify-center p-8">
              <div class="text-center max-w-md">
                <div class="mb-6">
                  <div class="inline-block p-4 bg-indigo-100 rounded-full mb-4">
                    <FileText class="w-16 h-16 text-indigo-600" />
                  </div>
                </div>
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Welcome to TaskBoard</h2>
                <p class="text-lg text-gray-600 mb-6">
                  Please sign in to access your task board and collaborate with your team.
                </p>
                <button
                  onClick={openLoginModal}
                  class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Sign In to Continue
                </button>
              </div>
            </div>
          }
        >
          {/* Authenticated Content */}
          <BoardView />

          {/* Widgets (only shown when authenticated) */}
          <ChatWidget />
          <PresenceWidget />
        </Show>
      </main>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen()} onClose={closeLoginModal} />
    </div>
  );
};
