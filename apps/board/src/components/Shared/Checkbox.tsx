import { type JSX, Show, splitProps } from 'solid-js';
import styles from '../../styles/components/Checkbox.module.css';
import { classList } from '../../utils/classList';

export interface CheckboxProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  name: string;
}

export const Checkbox = (props: CheckboxProps) => {
  const [local, inputProps] = splitProps(props, ['label', 'id', 'name', 'class']);

  return (
    <div class={styles.container}>
      <input
        {...inputProps}
        id={local.id}
        name={local.name}
        type="checkbox"
        class={classList(styles.checkbox, local.class)}
      />
      <Show when={local.label}>
        <label for={local.id} class={styles.label}>
          {local.label}
        </label>
      </Show>
    </div>
  );
};
