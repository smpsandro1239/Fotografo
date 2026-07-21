'use client';

import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Algo correu mal</h2>
          <p className="text-muted-foreground mb-4">
            {this.state.error?.message || 'Ocorreu um erro inesperado.'}
          </p>
          <Button onClick={() => this.setState({ hasError: false, error: null })}>
            Tentar Novamente
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
