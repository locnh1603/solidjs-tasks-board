import { type JSX } from 'solid-js';
import styles from '../../styles/components/Link.module.css';
import { classList } from '../../utils/classList';

export interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: JSX.Element;
  class?: string;
}

export const Link = (props: LinkProps) => (
  <a class={classList(styles.link, props.class)} {...props}>
    {props.children}
  </a>
);
