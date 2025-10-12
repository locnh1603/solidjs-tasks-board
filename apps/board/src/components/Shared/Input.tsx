import { type JSX, Show, mergeProps, splitProps } from 'solid-js';
import styles from '../../styles/components/Input.module.css';
import { classList } from '../../utils/classList';

export type InputVariant = 'default' | 'error' | 'success';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input visual style variant
   * @default 'default'
   */
  variant?: InputVariant;

  /**
   * Input size
   * @default 'md'
   */
  size?: InputSize;

  /**
   * Label text for the input
   */
  label?: string;

  /**
   * Helper text displayed below the input
   */
  helperText?: string;

  /**
   * Error message displayed below the input
   */
  error?: string;

  /**
   * Success message displayed below the input
   */
  success?: string;

  /**
   * Whether the input is required
   * @default false
   */
  required?: boolean;

  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the input takes full width
   * @default true
   */
  fullWidth?: boolean;

  /**
   * Icon to display on the left side
   */
  leftIcon?: JSX.Element;

  /**
   * Icon to display on the right side
   */
  rightIcon?: JSX.Element;

  /**
   * Custom class names for the input wrapper
   */
  class?: string;

  /**
   * Custom class names for the input element
   */
  inputClass?: string;
}

/**
 * Reusable Input component with Tailwind CSS styling and theme variables
 *
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   required
 * />
 */
export const Input = (props: InputProps) => {
  const merged = mergeProps(
    {
      variant: 'default' as InputVariant,
      size: 'md' as InputSize,
      required: false,
      disabled: false,
      fullWidth: true,
      type: 'text' as const,
    },
    props
  );

  const [local, others] = splitProps(merged, [
    'variant',
    'size',
    'label',
    'helperText',
    'error',
    'success',
    'required',
    'disabled',
    'fullWidth',
    'leftIcon',
    'rightIcon',
    'class',
    'inputClass',
  ]);

  // Determine the actual variant based on error/success props
  const effectiveVariant = () => {
    if (local.error) {
      return 'error';
    }
    if (local.success) {
      return 'success';
    }
    return local.variant;
  };

  // Wrapper class
  const wrapperClass = () => classList(local.fullWidth && styles.wrapperFull, local.class);

  // Input class combining all styles
  const inputClass = () =>
    classList(
      styles.input,
      styles[effectiveVariant()],
      styles[local.size],
      local.disabled && styles.disabled,
      !!local.leftIcon && styles.withLeftIcon,
      !!local.rightIcon && styles.withRightIcon,
      local.fullWidth && styles.fullWidth,
      local.inputClass
    );

  return (
    <div class={wrapperClass()}>
      {/* Label */}
      <Show when={local.label}>
        <label for={others.id} class={styles.label}>
          {local.label}
          <Show when={local.required}>
            <span class={styles.required}>*</span>
          </Show>
        </label>
      </Show>

      {/* Input Container */}
      <div class={styles.inputContainer}>
        {/* Left Icon */}
        <Show when={local.leftIcon}>
          <div class={classList(styles.iconWrapper, styles.iconLeft)}>
            <span class={styles.icon}>{local.leftIcon}</span>
          </div>
        </Show>

        {/* Input Element */}
        <input class={inputClass()} disabled={local.disabled} {...others} />

        {/* Right Icon */}
        <Show when={local.rightIcon}>
          <div class={classList(styles.iconWrapper, styles.iconRight)}>
            <span class={styles.icon}>{local.rightIcon}</span>
          </div>
        </Show>
      </div>

      {/* Error Message */}
      <Show when={local.error}>
        <p class={classList(styles.message, styles.messageError)}>{local.error}</p>
      </Show>

      {/* Success Message */}
      <Show when={local.success}>
        <p class={classList(styles.message, styles.messageSuccess)}>{local.success}</p>
      </Show>

      {/* Helper Text */}
      <Show when={local.helperText && !local.error && !local.success}>
        <p class={classList(styles.message, styles.messageHelper)}>{local.helperText}</p>
      </Show>
    </div>
  );
};

export default Input;
