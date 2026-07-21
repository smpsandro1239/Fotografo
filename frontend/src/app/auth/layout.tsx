import { Camera } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 font-display text-2xl font-bold text-primary">
            <Camera className="h-10 w-10" />
            <span>Fotografo</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
