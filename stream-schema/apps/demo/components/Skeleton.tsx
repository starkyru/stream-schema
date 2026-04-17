export function Skeleton({ w, h = 16 }: { w?: string | number; h?: number }) {
  return <div className="skeleton" style={{ width: w ?? '100%', height: h, borderRadius: 4 }} />;
}
