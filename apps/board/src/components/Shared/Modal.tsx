import { type JSX, Show, createEffect, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Motion } from 'solid-motionone';
import { X } from 'lucide-solid';
import { Button } from './Button';

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

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
};

export const Modal = (props: ModalProps) => {
  const size = () => props.size ?? 'md';
  const showCloseButton = () => props.showCloseButton ?? true;
  const closeOnBackdropClick = () => props.closeOnBackdropClick ?? true;
  const closeOnEscape = () => props.closeOnEscape ?? true;

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
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleBackdropClick}
        >
          {/* Modal Container */}
          <Motion.div
            class={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size()]}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <Show when={props.title ?? showCloseButton()}>
              <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <Show when={props.title}>
                  <h2 class="text-xl font-semibold text-gray-900">{props.title}</h2>
                </Show>
                <Show when={showCloseButton()}>
                  <Button
                    onClick={() => props.onClose()}
                    variant="ghost"
                    size="sm"
                    class="ml-auto p-1 rounded-lg"
                    aria-label="Close modal"
                    leftIcon={<X class="w-5 h-5" />}
                  />
                </Show>
              </div>
            </Show>

            {/* Content */}
            <div class="p-6">{props.children}</div>
          </Motion.div>
        </Motion.div>
      </Portal>
    </Show>
  );
};
