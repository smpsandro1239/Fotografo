import { Aperture } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      {/* Ambient glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2.5">
            <Aperture className="h-9 w-9 text-gold" strokeWidth={1.5} />
            <span className="font-display text-2xl font-semibold tracking-wide gold-text">LUMINA</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
