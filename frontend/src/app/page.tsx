import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Calendar, Package, Star, ArrowRight, CheckCircle, Aperture, Eye, CreditCard, Lock } from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: 'Galerias Imersivas',
    description: 'Grid responsivo, fullscreen com zoom, favoritos e seleção de fotos. Uma experiência de visualização que encanta.',
  },
  {
    icon: Calendar,
    title: 'Gestão de Eventos',
    description: 'Crie eventos, defina packs, adicione veículos, controle disponibilidade e publique com um clique.',
  },
  {
    icon: CreditCard,
    title: 'Pagamentos Integrados',
    description: 'Checkout Stripe seguro com cartão, MB Way e Multibanco. Reservas confirmadas automaticamente.',
  },
  {
    icon: Lock,
    title: 'Segurança Premium',
    description: 'URLs assinadas, controlo de acesso por roles, anti-screenshot e conformidade total com LGPD.',
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

const galleryItems = [
  {
    title: 'Casamento',
    subtitle: 'Lisboa',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=800&fit=crop&q=80',
    large: true,
  },
  {
    title: 'Evento Corporativo',
    subtitle: 'Porto',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=450&fit=crop&q=80',
  },
  {
    title: 'Sessão de Retrato',
    subtitle: 'Braga',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=450&fit=crop&q=80',
  },
  {
    title: 'Aniversário',
    subtitle: 'Faro',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=450&fit=crop&q=80',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <Aperture className="h-7 w-7 text-gold" strokeWidth={1.5} />
              <span className="font-display text-xl font-semibold tracking-wide gold-text">LUMINA</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300">
                Funcionalidades
              </Link>
              <Link href="#gallery" className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300">
                Galeria
              </Link>
              <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300">
                Depoimentos
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300">
                Entrar
              </Link>
              <Button asChild size="sm" className="gold-gradient text-background font-medium hover:opacity-90 transition-opacity">
                <Link href="/auth/register">Começar Grátis</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920&h=1080&fit=crop&q=80"
            alt=""
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-xs font-medium text-gold mb-8 tracking-wider uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold"></span>
              </span>
              Novo: App Mobile para Clientes
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 font-display leading-[1.1]">
              A plataforma para{' '}
              <span className="gold-text">fotógrafos</span>{' '}
              <br className="hidden sm:block" />
              que pensam a sério
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Gere eventos, crie galerias deslumbrantes, aceite reservas com pagamento online e entregue 
              uma experiência premium aos seus clientes. Tudo num só lugar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Button asChild size="lg" className="gold-gradient text-background font-medium hover:opacity-90 transition-opacity gap-2 w-full sm:w-auto px-8">
                <Link href="/auth/register">
                  Começar Grátis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gold/20 text-foreground hover:bg-gold/5 hover:border-gold/40 transition-all duration-300 w-full sm:w-auto px-8">
                <Link href="#features">Ver Funcionalidades</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-gold" />
                <span>14 dias grátis</span>
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-gold" />
                <span>Sem cartão de crédito</span>
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-gold" />
                <span>Cancelar a qualquer momento</span>
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-gold/10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold font-display gold-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-surface-light/50 to-background pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-medium tracking-widest uppercase text-gold mb-4">Funcionalidades</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-display mb-6">
              Tudo o que precisa para{' '}
              <span className="gold-text">elevar o seu negócio</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Funcionalidades desenhadas por fotógrafos, para fotógrafos. Foque-se na arte, nós tratamos do resto.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl gold-border bg-card/50 hover:bg-card hover:gold-border-hover transition-all duration-500 luxury-shadow"
              >
                <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/15 transition-colors duration-500">
                  <feature.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold mb-2 font-display">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Showcase */}
      <section id="gallery" className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-medium tracking-widest uppercase text-gold mb-4">Galerias</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-display mb-6">
              Experiências que{' '}
              <span className="gold-text">encantam clientes</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Entregue uma experiência de visualização premium que os seus clientes vão adorar.
            </p>
          </div>

          {/* Gallery grid with real photos */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryItems.map((item, i) => (
              <div
                key={item.title}
                className={`relative group overflow-hidden rounded-xl gold-border ${
                  i === 0 ? 'md:col-span-2 md:row-span-2 aspect-square' : 'aspect-[4/3]'
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes={i === 0 ? '(max-width: 768px) 50vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-display text-lg font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                </div>
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>

          {/* Feature list */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {[
              'Grid responsivo com lazy loading otimizado',
              'Modo fullscreen com zoom e navegação por teclado',
              'Sistema de favoritos sincronizado entre dispositivos',
              'Seleção de fotos para encomenda com carrinho integrado',
              'Anti-screenshot e watermark dinâmico no app mobile',
              'URLs assinadas com expiração configurável',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-gold flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features - Management */}
      <section className="py-20 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-surface-light/50 to-background pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-gold mb-4">Gestão</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-display mb-6">
                Eventos{' '}
                <span className="gold-text">sem complicações</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
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
                    <CheckCircle className="h-4 w-4 text-gold flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl gold-border overflow-hidden luxury-shadow">
              <Image
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&q=80"
                alt="Gestão de eventos"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mt-24">
            <div className="relative aspect-[4/3] rounded-2xl gold-border overflow-hidden luxury-shadow order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&q=80"
                alt="Pagamentos integrados"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-xs font-medium tracking-widest uppercase text-gold mb-4">Pagamentos</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-display mb-6">
                Reservas{' '}
                <span className="gold-text">automatizadas</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
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
                    <CheckCircle className="h-4 w-4 text-gold flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-medium tracking-widest uppercase text-gold mb-4">Depoimentos</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-display mb-6">
              Confiado por{' '}
              <span className="gold-text">centenas de fotógrafos</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Veja o que os profissionais dizem sobre a plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl gold-border bg-card/50 hover:bg-card transition-all duration-500 luxury-shadow"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gold">{testimonial.author[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 gold-border luxury-shadow-lg">
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=600&fit=crop&q=80"
                alt=""
                fill
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-surface/90 via-surface/80 to-surface/90" />
            </div>
            
            {/* Decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-gold/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-6">
                Pronto para{' '}
                <span className="gold-text">transformar</span>
                <br className="hidden sm:block" /> o seu negócio?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                Junte-se a centenas de fotógrafos que já usam o LUMINA para gerir eventos, 
                encantar clientes e crescer receitas.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="gold-gradient text-background font-medium hover:opacity-90 transition-opacity gap-2 w-full sm:w-auto px-8">
                  <Link href="/auth/register">
                    Começar Grátis por 14 Dias
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-gold/20 text-foreground hover:bg-gold/5 hover:border-gold/40 transition-all duration-300 w-full sm:w-auto px-8">
                  <Link href="#contact">Falar com Vendas</Link>
                </Button>
              </div>
              <p className="mt-8 text-xs text-muted-foreground tracking-wide">
                Sem cartão de crédito · Cancelar a qualquer momento · Setup em minutos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gold/10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <Aperture className="h-6 w-6 text-gold" strokeWidth={1.5} />
                <span className="font-display text-lg font-semibold tracking-wide gold-text">LUMINA</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                A plataforma premium para fotógrafos de eventos. 
                Galerias deslumbrantes, reservas automatizadas, gestão completa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Produto</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-gold transition-colors duration-300">Funcionalidades</Link></li>
                <li><Link href="#pricing" className="hover:text-gold transition-colors duration-300">Preços</Link></li>
                <li><Link href="/docs" className="hover:text-gold transition-colors duration-300">Documentação</Link></li>
                <li><Link href="/api" className="hover:text-gold transition-colors duration-300">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-gold transition-colors duration-300">Privacidade</Link></li>
                <li><Link href="/terms" className="hover:text-gold transition-colors duration-300">Termos</Link></li>
                <li><Link href="/cookies" className="hover:text-gold transition-colors duration-300">Cookies</Link></li>
                <li><Link href="/security" className="hover:text-gold transition-colors duration-300">Segurança</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gold/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} LUMINA. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-5">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold transition-colors duration-300">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold transition-colors duration-300">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold transition-colors duration-300">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold transition-colors duration-300">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
