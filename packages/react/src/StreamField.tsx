import React from 'react';

export interface StreamFieldProps<T extends string | number = string> {
  /**
   * The streaming value. Renders skeleton while undefined/null/empty.
   * Renders children or value once available.
   */
  value: T | undefined | null;
  /**
   * Custom skeleton to show while value is pending.
   * Defaults to an inline span with data-stream-skeleton attribute for styling.
   */
  skeleton?: React.ReactNode;
  /**
   * Render prop - called with the resolved value once available.
   * If omitted, value is rendered as a text node inside `as`.
   */
  children?: (value: T) => React.ReactNode;
  /** HTML tag to wrap the value in. Defaults to 'span'. */
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Headless primitive that shows a skeleton while a streaming value is pending,
 * then renders the value (or children) once it arrives.
 *
 * Styling: use [data-stream-skeleton] and [data-stream-field] CSS selectors,
 * or pass className/style to both states.
 *
 * @example
 * <StreamField value={data.title} skeleton={<span className="skeleton" />}>
 *   {(title) => <h1>{title}</h1>}
 * </StreamField>
 */
export function StreamField<T extends string | number = string>({
  value,
  skeleton,
  children,
  as: Tag = 'span',
  className,
  style,
}: StreamFieldProps<T>) {
  const isPending = value === undefined || value === null || value === '';

  if (isPending) {
    return skeleton ? (
      <>{skeleton}</>
    ) : (
      <span
        data-stream-skeleton=""
        aria-hidden="true"
        className={className}
        style={style}
      />
    );
  }

  if (children) {
    return <>{children(value)}</>;
  }

  return (
    <Tag data-stream-field="" className={className} style={style}>
      {value}
    </Tag>
  );
}
