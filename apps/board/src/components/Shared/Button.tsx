import { type JSX, Show, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { LoaderCircle } from 'lucide-solid';

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

  // Base styles applied to all buttons
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transform';

  // Variant styles
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:ring-indigo-500 shadow-sm hover:shadow-md',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-500 shadow-sm hover:shadow-md',
    outline:
      'border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 focus:ring-gray-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-sm hover:shadow-md',
    success:
      'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500 shadow-sm hover:shadow-md',
  };

  // Size styles
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
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
        <LoaderCircle class="animate-spin flex-shrink-0 h-4 w-4" />
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
  );
};

export default Button;
