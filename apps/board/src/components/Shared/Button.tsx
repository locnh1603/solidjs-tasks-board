import { type JSX, Show, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { LoaderCircle } from 'lucide-solid';
import { Motion } from 'solid-motionone';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
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

  // Base styles applied to all buttons using theme variables
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed [font-family:var(--font-sans)] [font-weight:var(--font-weight-medium)]';

  // Variant styles using theme color variables
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-primary-500 [box-shadow:var(--shadow-sm)] hover:[box-shadow:var(--shadow-md)]',
    secondary:
      'bg-secondary-200 text-secondary-900 hover:bg-secondary-300 active:bg-secondary-400 focus:ring-secondary-500 [box-shadow:var(--shadow-sm)] hover:[box-shadow:var(--shadow-md)]',
    outline:
      'border-2 border-neutral-300 bg-transparent [color:var(--text-base)] hover:bg-neutral-50 hover:border-neutral-400 active:bg-neutral-100 focus:ring-neutral-500',
    ghost:
      'bg-transparent [color:var(--text-base)] hover:bg-neutral-100 active:bg-neutral-200 focus:ring-neutral-500',
    danger:
      'bg-error-600 text-white hover:bg-error-700 active:bg-error-800 focus:ring-error-500 [box-shadow:var(--shadow-sm)] hover:[box-shadow:var(--shadow-md)]',
    success:
      'bg-success-600 text-white hover:bg-success-700 active:bg-success-800 focus:ring-success-500 [box-shadow:var(--shadow-sm)] hover:[box-shadow:var(--shadow-md)]',
  };

  // Size styles using theme font-size variables
  const sizeStyles: Record<ButtonSize, string> = {
    sm: '[font-size:var(--font-size-xs)] px-3 py-1.5 gap-1.5',
    md: '[font-size:var(--font-size-sm)] px-4 py-2.5 gap-2',
    lg: '[font-size:var(--font-size-base)] px-6 py-3 gap-2.5',
  };

  // Combine all styles
  const buttonClass = () =>
    [
      baseStyles,
      variantStyles[local.variant],
      sizeStyles[local.size],
      local.fullWidth ? 'w-full' : '',
      local.class ?? '',
    ]
      .filter(Boolean)
      .join(' ');

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
          <span class="flex-shrink-0">{local.leftIcon}</span>
        </Show>

        {/* Loading Spinner */}
        <Show when={local.loading}>
          <Motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, easing: 'linear' }}
            class="flex-shrink-0"
          >
            <LoaderCircle class="h-4 w-4" />
          </Motion.div>
        </Show>

        {/* Button Content */}
        <Show when={local.children}>
          <span class="flex-1">{local.children}</span>
        </Show>

        {/* Right Icon */}
        <Show when={local.rightIcon && !local.loading}>
          <span class="flex-shrink-0">{local.rightIcon}</span>
        </Show>
      </Dynamic>
    </Motion.div>
  );
};

export default Button;
