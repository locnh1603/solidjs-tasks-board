import { Show, createSignal } from 'solid-js';
import { FileText } from 'lucide-solid';
import { authState } from '../../stores/authStore';
import { Header } from './Header';
import { LoginModal } from '../Auth/LoginModal';
import { BoardView } from '../Board/BoardView';
import { ChatWidget } from '../Chat/ChatWidget';
import { PresenceWidget } from '../Presence/PresenceWidget';
import { Button } from '../Shared/Button';
import styles from '../../styles/layouts/MainLayout.module.css';

export const MainLayout = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = createSignal(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <div class={styles.layout}>
      {/* Header */}
      <Header onLoginClick={openLoginModal} />

      {/* Main Content */}
      <main class={styles.main}>
        <Show
          when={authState.user}
          fallback={
            <div class={styles.welcomeContainer}>
              <div class={styles.welcomeContent}>
                <div class={styles.iconWrapper}>
                  <div class={styles.iconCircle}>
                    <FileText class={styles.icon} />
                  </div>
                </div>
                <h2 class={styles.welcomeTitle}>Welcome to TaskBoard</h2>
                <p class={styles.welcomeText}>
                  Please sign in to access your task board and collaborate with your team.
                </p>
                <Button variant="primary" size="lg" onClick={openLoginModal}>
                  Sign In to Continue
                </Button>
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
