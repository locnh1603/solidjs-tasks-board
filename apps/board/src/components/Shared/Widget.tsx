import { type JSX } from 'solid-js';

export interface WidgetProps {
  /**
   * Widget title
   */
  title: string;

  /**
   * Widget content
   */
  children: JSX.Element;

  /**
   * Widget position
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

  /**
   * Custom class names
   */
  class?: string;
}

const positionClasses = {
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
};

export const Widget = (props: WidgetProps) => {
  const position = () => props.position ?? 'bottom-right';

  return (
    <div
      class={`fixed ${positionClasses[position()]} bg-white rounded-lg shadow-lg border border-gray-200 max-w-sm w-80 ${props.class ?? ''}`}
    >
      {/* Widget Header */}
      <div class="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
        <h3 class="text-sm font-semibold text-gray-900">{props.title}</h3>
      </div>

      {/* Widget Content */}
      <div class="p-4 max-h-96 overflow-y-auto">{props.children}</div>
    </div>
  );
};
