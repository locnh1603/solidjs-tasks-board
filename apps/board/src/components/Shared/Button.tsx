import { type JSX, Show, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { LoaderCircle } from 'lucide-solid';
import { Motion } from 'solid-motionone';
import styles from '../../styles/components/Button.module.css';
import { classList } from '../../utils/classList';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button visual style variant
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Whether button is in loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Whether button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Icon to display before text
   */
  leftIcon?: JSX.Element;

  /**
   * Icon to display after text
   */
  rightIcon?: JSX.Element;

  /**
   * Button content
   */
  children?: JSX.Element;

  /**
   * Custom class names
   */
  class?: string;

  /**
   * Element type to render as (button or a)
   * @default 'button'
   */
  as?: 'button' | 'a';
}

/**
 * Reusable Button component with Tailwind CSS styling and animations
 *
 * @example
 * <Button variant="primary" size="md" onClick={() => console.log('clicked')}>
 *   Click Me
 * </Button>
 */
export const Button = (props: ButtonProps) => {
  const merged = mergeProps(
    {
      variant: 'primary' as ButtonVariant,
      size: 'md' as ButtonSize,
      loading: false,
      disabled: false,
      fullWidth: false,
      as: 'button' as const,
      type: 'button' as const,
    },
    props
  );

  const [local, others] = splitProps(merged, [
    'variant',
    'size',
    'loading',
    'disabled',
    'fullWidth',
    'leftIcon',
    'rightIcon',
    'children',
    'class',
    'as',
  ]);

  // Combine CSS Module classes
  const buttonClass = () => {
    const isLink = local.variant === 'link';

    return classList(
      // Base styles
      isLink ? styles.linkBase : styles.button,
      // Variant styles
      styles[local.variant],
      // Size styles (not applied to link variant)
      !isLink && styles[local.size],
      // Modifiers
      local.fullWidth && styles.fullWidth,
      // Custom classes
      local.class
    );
  };

  const isDisabled = () => local.disabled || local.loading;

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Dynamic
        component={local.as}
        class={buttonClass()}
        disabled={isDisabled()}
        aria-disabled={isDisabled()}
        aria-busy={local.loading}
        {...others}
      >
        {/* Left Icon */}
        <Show when={local.leftIcon && !local.loading}>
          <span class={styles.iconLeft}>{local.leftIcon}</span>
        </Show>

        {/* Loading Spinner */}
        <Show when={local.loading}>
          <Motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, easing: 'linear' }}
            class={styles.spinner}
          >
            <LoaderCircle class="h-4 w-4" />
          </Motion.div>
        </Show>

        {/* Button Content */}
        <Show when={local.children}>
          <span class={styles.content}>{local.children}</span>
        </Show>

        {/* Right Icon */}
        <Show when={local.rightIcon && !local.loading}>
          <span class={styles.iconRight}>{local.rightIcon}</span>
        </Show>
      </Dynamic>
    </Motion.div>
  );
};

export default Button;
