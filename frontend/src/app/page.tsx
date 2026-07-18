import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Camera, Calendar, Package, Shield, Star, ArrowRight, CheckCircle, Users } from 'lucide-react';

const features = [
  {
    icon: Camera,
    title: 'Galerias Premium',
    description: 'Galerias elegantes com visualização fullscreen, favoritos, seleção de fotos e proteção anti-screenshot.',
  },
  {
    icon: Calendar,
    title: 'Gestão de Eventos',
    description: 'Crie e gerencie eventos com packs personalizados, veículos, disponibilidade e publicação controlada.',
  },
  {
    icon: Package,
    title: 'Reservas e Pagamentos',
    description: 'Sistema completo de reservas com checkout Stripe, gestão de encomendas e acompanhamento de pagamentos.',
  },
  {
    icon: Shield,
    title: 'Segurança e Privacidade',
    description: 'Fotos protegidas com URLs assinadas, controle de acesso por roles e conformidade LGPD.',
  },
];

const stats = [
  { value: '500+', label: 'Fotógrafos ativos' },
  { value: '10k+', label: 'Eventos geridos' },
  { value: '1M+', label: 'Fotos protegidas' },
  { value: '99.9%', label: 'Uptime garantido' },
];

const testimonials = [
  {
    quote: 'A melhor plataforma que já usei. As galerias são lindas e os clientes adoram a experiência.',
    author: 'João Silva',
    role: 'Fotógrafo de Casamentos',
  },
  {
    quote: 'Finalmente uma ferramenta que entende o fluxo de trabalho de um fotógrafo profissional.',
    author: 'Maria Santos',
    role: 'Fotógrafa de Eventos',
  },
  {
    quote: 'O sistema de reservas e pagamentos automáticos poupa-me horas de trabalho administrativo.',
    author: 'Pedro Costa',
    role: 'Estúdio Fotográfico',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
              <Camera className="h-8 w-8" />
              <span>Fotografo</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Funcionalidades
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Preços
              </Link>
              <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Depoimentos
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Entrar
              </Link>
              <Button asChild size="sm">
                <Link href="/auth/register">Começar Grátis</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Novo: App Mobile para Clientes
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 font-display">
              A plataforma mais completa para <span className="text-primary">fotógrafos profissionais</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Gere eventos, crie galerias deslumbrantes, aceite reservas com pagamento online e entregue 
              uma experiência premium aos seus clientes. Tudo num só lugar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button asChild size="lg" className="w-full sm:w-auto gap-2">
                <Link href="/auth/register">
                  Começar Grátis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="#demo">Ver Demo</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green" />
                <span>14 dias grátis</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green" />
                <span>Sem cartão de crédito</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green" />
                <span>Cancelar a qualquer momento</span>
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-foreground font-display">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display mb-4">
              Tudo o que precisa para <span className="text-primary">elevar o seu negócio</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Funcionalidades desenhadas por fotógrafos, para fotógrafos. Foque-se na arte, nós tratamos do resto.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display mb-6">
                Galerias que <span className="text-primary">encantam clientes</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Entregue uma experiência de visualização premium. Grid responsivo, fullscreen imersivo, 
                favoritos, seleção de fotos para encomenda e proteção anti-screenshot no mobile.
              </p>
              <ul className="space-y-4">
                {[
                  'Visualização em grid com lazy loading otimizado',
                  'Modo fullscreen com zoom e navegação por teclado',
                  'Sistema de favoritos sincronizado entre dispositivos',
                  'Seleção de fotos para encomenda com carrinho integrado',
                  'Anti-screenshot e watermark dinâmico no app mobile',
                  'URLs assinadas com expiração configurável',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-border">
              <div className="absolute inset-0 flex items-center justify-center text-primary/50">
                <Camera className="h-24 w-24" />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mt-20">
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-border">
              <div className="absolute inset-0 flex items-center justify-center text-primary/50">
                <Calendar className="h-24 w-24" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display mb-6">
                Gestão de eventos <span className="text-primary">sem complicações</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Do agendamento à entrega. Crie eventos, defina packs com preços, adicione veículos, 
                controle disponibilidade e publique quando estiver pronto.
              </p>
              <ul className="space-y-4">
                {[
                  'CRUD completo de eventos com datas, localização e descrição',
                  'Packs personalizados com preços, descrição e veículos associados',
                  'Controlo de disponibilidade de veículos por data',
                  'Publicação/despublicação instantânea com um clique',
                  'Álbuns ilimitados por evento com organização flexível',
                  'Estatísticas de visualizações e interações por evento',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mt-20">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display mb-6">
                Reservas e pagamentos <span className="text-primary">automatizados</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Integração nativa com Stripe. Clientes reservam e pagam online, você recebe notificações 
                instantâneas e o estado atualiza automaticamente. Sem perseguir pagamentos.
              </p>
              <ul className="space-y-4">
                {[
                  'Checkout Stripe seguro (cartão, MB Way, Multibanco)',
                  'Payment Intents com confirmação automática de reservas',
                  'Webhooks para sincronização em tempo real',
                  'Reembolsos parciais ou totais com um clique',
                  'Faturação automática e recibos por email',
                  'Dashboard financeiro com receitas por período',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-border">
              <div className="absolute inset-0 flex items-center justify-center text-primary/50">
                <Package className="h-24 w-24" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 lg:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display mb-4">
              Confiado por <span className="text-primary">centenas de fotógrafos</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Veja o que os profissionais dizem sobre a plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-primary rounded-3xl p-8 sm:p-12 lg:p-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground font-display mb-6">
              Pronto para transformar o seu negócio?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Junte-se a centenas de fotógrafos que já usam o Fotografo para gerir eventos, 
              encantar clientes e crescer receitas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 w-full sm:w-auto">
                <Link href="/auth/register">
                  Começar Grátis por 14 Dias
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto">
                <Link href="#contact">Falar com Vendas</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-primary-foreground/70">
              Sem cartão de crédito • Cancelar a qualquer momento • Setup em minutos
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary mb-4">
                <Camera className="h-8 w-8" />
                <span>Fotografo</span>
              </Link>
              <p className="text-muted-foreground max-w-xs">
                A plataforma premium para fotógrafos de eventos. 
                Galerias deslumbrantes, reservas automatizadas, gestão completa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Funcionalidades</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Preços</Link></li>
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentação</Link></li>
                <li><Link href="/api" className="hover:text-foreground transition-colors">API</Link></li>
                <li><Link href="/changelog" className="hover:text-foreground transition-colors">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">Sobre Nós</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">Carreiras</Link></li>
                <li><Link href="/press" className="hover:text-foreground transition-colors">Imprensa</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacidade</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Termos</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground transition-colors">Cookies</Link></li>
                <li><Link href="/security" className="hover:text-foreground transition-colors">Segurança</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Fotografo. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}