import React from 'react';

export interface StreamListProps<T> {
  /**
   * The streaming array. Grows as items arrive.
   * Shows skeleton slots while undefined or empty.
   */
  items: T[] | undefined | null;
  /**
   * Render each item. Key is handled internally - no need to add key here.
   */
  children: (item: T, index: number) => React.ReactNode;
  /**
   * Skeleton slot shown for each pending item.
   * Defaults to a div with data-stream-skeleton.
   */
  skeleton?: React.ReactNode;
  /**
   * Number of skeleton slots to show while list is empty.
   * @default 3
   */
  skeletonCount?: number;
  /**
   * If true, skeleton slots are appended after real items while streaming.
   * Useful for lists that grow to a known length.
   * @default false
   */
  appendSkeletons?: boolean;
  /**
   * Expected final count - used with appendSkeletons to show the right
   * number of placeholder slots.
   */
  expectedCount?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Headless primitive for streaming arrays. Shows skeleton slots while empty,
 * renders items as they arrive, and optionally shows trailing skeletons
 * to indicate more are coming.
 *
 * @example
 * <StreamList items={data.items} skeletonCount={4} skeleton={<CardSkeleton />}>
 *   {(item) => <Card key={item.id} {...item} />}
 * </StreamList>
 */
export function StreamList<T>({
  items,
  children,
  skeleton,
  skeletonCount = 3,
  appendSkeletons = false,
  expectedCount,
  className,
  style,
}: StreamListProps<T>) {
  const defaultSkeleton = (
    <div data-stream-skeleton="" aria-hidden="true" />
  );

  const skeletonSlot = skeleton ?? defaultSkeleton;
  const hasItems = items && items.length > 0;

  const skeletonSlots = (count: number) =>
    Array.from({ length: count }, (_, i) => (
      <React.Fragment key={`skeleton-${i}`}>{skeletonSlot}</React.Fragment>
    ));

  // No items yet: show full skeleton
  if (!hasItems) {
    return (
      <div data-stream-list="" className={className} style={style}>
        {skeletonSlots(skeletonCount)}
      </div>
    );
  }

  // Calculate trailing skeletons if requested
  const trailingCount =
    appendSkeletons && expectedCount
      ? Math.max(0, expectedCount - items.length)
      : 0;

  return (
    <div data-stream-list="" className={className} style={style}>
      {items.map((item, i) => (
        <React.Fragment key={i}>{children(item, i)}</React.Fragment>
      ))}
      {skeletonSlots(trailingCount)}
    </div>
  );
}
