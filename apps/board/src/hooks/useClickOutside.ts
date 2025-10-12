import { type Accessor, onCleanup } from 'solid-js';

export interface UseClickOutsideOptions {
  /** Single ref or array of refs to monitor */
  refs: Accessor<HTMLElement | null | undefined> | Accessor<HTMLElement | null | undefined>[];
  /** Callback to execute when click occurs outside */
  onClickOutside: (event: MouseEvent | TouchEvent) => void;
}

/**
 * Hook to detect clicks outside of specified elements
 * @param options - Configuration object with refs and callback
 */
export const useClickOutside = (options: UseClickOutsideOptions) => {
  const { refs, onClickOutside } = options;
  const refArray = Array.isArray(refs) ? refs : [refs];

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    const target = event.target as Node;

    // Check if click is outside all referenced elements
    const isOutside = refArray.every((ref) => {
      const element = ref();
      return element && !element.contains(target);
    });

    if (isOutside) {
      onClickOutside(event);
    }
  };

  // Add event listeners
  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('touchstart', handleClickOutside);

  // Cleanup on unmount
  onCleanup(() => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('touchstart', handleClickOutside);
  });
};
