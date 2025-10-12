import { For, Show, createEffect, createSignal } from 'solid-js';
import styles from '../../styles/components/Dropdown.module.css';
import { classList } from '../../utils/classList';
import { Button } from './Button';

export interface DropdownOption {
  label: string;
  value: string;
}

export type DropdownSize = 'sm' | 'md' | 'lg';

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: DropdownSize;
  class?: string;
}

export const Dropdown = (props: DropdownProps) => {
  const [open, setOpen] = createSignal(false);
  const [selected, setSelected] = createSignal('');

  createEffect(() => {
    if (props.value !== undefined) {
      setSelected(props.value);
    }
  });

  const handleSelect = (value: string) => {
    setSelected(value);
    setOpen(false);
    props.onChange?.(value);
  };

  return (
    <div class={classList(styles.dropdown, props.class)}>
      <Button
        type="button"
        class={classList(styles.toggle, styles[props.size ?? 'lg'])}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open()}
        variant="outline"
        size={props.size ?? 'lg'}
      >
        <span class={styles.selected}>
          {selected()
            ? props.options.find((o) => o.value === selected())?.label
            : (props.placeholder ?? 'Select...')}
        </span>
        <span class={styles.arrow} aria-hidden="true">
          ▼
        </span>
      </Button>
      <Show when={open()}>
        <ul class={styles.menu} role="listbox">
          <For each={props.options}>
            {(option) => (
              <li
                class={classList(
                  styles.option,
                  selected() === option.value && styles.selectedOption
                )}
                role="option"
                aria-selected={selected() === option.value}
                onClick={() => handleSelect(option.value)}
                tabIndex={0}
              >
                {option.label}
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
};
