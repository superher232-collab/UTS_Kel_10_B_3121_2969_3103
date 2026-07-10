export default function Skeleton({ width, height, borderRadius = '4px', style }: {
  width?: string
  height?: string
  borderRadius?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: width || '100%',
        height: height || '16px',
        borderRadius,
        background: 'linear-gradient(90deg, rgba(168,85,247,0.08) 25%, rgba(168,85,247,0.18) 50%, rgba(168,85,247,0.08) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeletonShimmer 1.5s ease-in-out infinite',
        ...style
      }}
    />
  )
}
