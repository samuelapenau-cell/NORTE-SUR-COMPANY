"use client";

import { Component } from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h1 className="font-display text-4xl md:text-5xl text-offwhite tracking-[2px]">
              Algo salió <span className="text-accent">mal</span>
            </h1>
            <p className="mt-6 text-sm text-offwhite/40 font-body leading-relaxed">
              Ocurrió un error inesperado. Recarga la página o vuelve a intentarlo.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-gold text-black font-display text-lg tracking-[2px] rounded-sm hover:bg-gold-light transition-all duration-300"
              >
                Recargar página
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
