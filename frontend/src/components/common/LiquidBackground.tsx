export function LiquidBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-1/4 -left-1/4 w-[700px] h-[700px] rounded-full opacity-25 animate-blob1"
        style={{ background: 'radial-gradient(circle, rgba(185,245,0,0.3) 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full opacity-20 animate-blob2"
        style={{ background: 'radial-gradient(circle, rgba(139,195,74,0.25) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-20 animate-blob3"
        style={{ background: 'radial-gradient(circle, rgba(185,245,0,0.2) 0%, transparent 70%)' }}
      />
    </div>
  )
}
