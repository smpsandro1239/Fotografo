import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Aperture } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <Aperture className="h-12 w-12 text-gold/30 mb-6" strokeWidth={1} />
      <h1 className="text-6xl font-bold font-display gold-text mb-4">404</h1>
      <h2 className="text-2xl font-semibold font-display mb-2">Página não encontrada</h2>
      <p className="text-muted-foreground mb-8">
        A página que procuras não existe ou foi movida.
      </p>
      <Link href="/">
        <Button className="gold-gradient text-background font-medium hover:opacity-90 transition-opacity">
          Voltar ao Início
        </Button>
      </Link>
    </div>
  );
}
