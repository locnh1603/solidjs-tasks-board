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
    <div class="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-primary-300 flex flex-col [font-family:var(--font-sans)]">
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
                  <div class="inline-block p-4 bg-primary-100 [border-radius:var(--radius-full)] mb-4">
                    <FileText class="w-16 h-16 text-primary-600" />
                  </div>
                </div>
                <h2 class="[font-size:var(--font-size-3xl)] [font-weight:var(--font-weight-bold)] [color:var(--text-base)] mb-4">
                  Welcome to TaskBoard
                </h2>
                <p class="[font-size:var(--font-size-lg)] [color:var(--text-muted)] mb-6">
                  Please sign in to access your task board and collaborate with your team.
                </p>
                <button
                  onClick={openLoginModal}
                  class="px-6 py-3 text-white bg-primary-600 [font-weight:var(--font-weight-medium)] [border-radius:var(--radius-lg)] hover:bg-primary-700 [box-shadow:var(--shadow-md)] hover:[box-shadow:var(--shadow-lg)]"
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
