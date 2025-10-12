import { type JSX, Show, createEffect, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Motion } from 'solid-motionone';
import { X } from 'lucide-solid';
import { Button } from './Button';
import styles from '../../styles/components/Modal.module.css';

export interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;

  /**
   * Callback when modal requests to close
   */
  onClose: () => void;

  /**
   * Modal title
   */
  title?: string;

  /**
   * Modal content
   */
  children: JSX.Element;

  /**
   * Modal size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * Whether to show close button
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Whether clicking backdrop closes modal
   * @default true
   */
  closeOnBackdropClick?: boolean;

  /**
   * Whether pressing Escape closes modal
   * @default true
   */
  closeOnEscape?: boolean;
}

export const Modal = (props: ModalProps) => {
  const size = () => props.size ?? 'md';
  const showCloseButton = () => props.showCloseButton ?? true;
  const closeOnBackdropClick = () => props.closeOnBackdropClick ?? true;
  const closeOnEscape = () => props.closeOnEscape ?? true;

  // Compute modal container classes
  const containerClass = () => {
    const classes = [styles.container];
    const sizeClass = styles[size()];
    if (sizeClass) {
      classes.push(sizeClass);
    }
    return classes.join(' ');
  };

  // Handle escape key
  createEffect(() => {
    if (!props.isOpen || !closeOnEscape()) {
      return;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        props.onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    onCleanup(() => document.removeEventListener('keydown', handleEscape));
  });

  // Prevent body scroll when modal is open
  createEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    onCleanup(() => {
      document.body.style.overflow = '';
    });
  });

  const handleBackdropClick = (e: MouseEvent) => {
    if (closeOnBackdropClick() && e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <Show when={props.isOpen}>
      <Portal>
        {/* Backdrop */}
        <Motion.div
          class={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleBackdropClick}
        >
          {/* Modal Container */}
          <Motion.div
            class={containerClass()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Show when={props.title ?? showCloseButton()}>
              <div class={styles.header}>
                <Show when={props.title} fallback={<span />}>
                  <h2 class={styles.title}>{props.title}</h2>
                </Show>
                <Show when={showCloseButton()}>
                  <Button
                    onClick={() => props.onClose()}
                    variant="ghost"
                    size="sm"
                    class={styles.closeButton}
                    aria-label="Close modal"
                    leftIcon={<X class="w-5 h-5" />}
                  />
                </Show>
              </div>
            </Show>

            {/* Content */}
            <div class={styles.content}>{props.children}</div>
          </Motion.div>
        </Motion.div>
      </Portal>
    </Show>
  );
};
