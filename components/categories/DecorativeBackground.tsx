"use client"
// components/categories/DecorativeBackground.tsx
export default function DecorativeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -left-40 w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-br from-yellow-200/30 to-amber-300/30 rounded-full blur-3xl animate-pulse" />
      <div 
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] bg-gradient-to-tl from-amber-200/30 to-yellow-300/30 rounded-full blur-3xl" 
        style={{ animationDelay: '1s', animationDuration: '4s' }} 
      />
      
      <div 
        className="absolute top-32 right-20 w-16 h-16 sm:w-20 sm:h-20 border-4 border-yellow-300/20 rounded-full" 
        style={{ animation: 'float 6s ease-in-out infinite' }} 
      />
      <div 
        className="absolute bottom-40 left-20 w-12 h-12 sm:w-16 sm:h-16 border-4 border-amber-300/20 rounded-lg rotate-45" 
        style={{ animation: 'float 8s ease-in-out infinite', animationDelay: '0.5s' }} 
      />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgb(251,191,36,0.08)_1px,_transparent_0)] bg-[length:40px_40px]" />

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
}
