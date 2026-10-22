import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Calendar, Ticket, BellRing, Euro } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";

describe("<StatsCard />", () => {
  it("renderiza título, valor e descrição", () => {
    render(
      <StatsCard title="Total de Eventos" value={42} icon={Calendar} description="+3 esta semana" />
    );
    expect(screen.getByText("Total de Eventos")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("+3 esta semana")).toBeInTheDocument();
  });

  it("funciona sem descrição", () => {
    render(<StatsCard title="Reservas Pendentes" value={7} icon={Ticket} />);
    expect(screen.getByText("Reservas Pendentes")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("aceita valores formatados como string (euros)", () => {
    render(<StatsCard title="Receita Estimada" value="1.250,00 €" icon={Euro} />);
    expect(screen.getByText("1.250,00 €")).toBeInTheDocument();
  });

  it("o grid de 4 cards do dashboard renderiza todos", () => {
    render(
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total de Eventos" value={10} icon={Calendar} />
        <StatsCard title="Reservas Pendentes" value={2} icon={Ticket} />
        <StatsCard title="Notificações Não Lidas" value={5} icon={BellRing} />
        <StatsCard title="Receita Estimada" value="—" icon={Euro} />
      </div>
    );
    expect(screen.getByText("Total de Eventos")).toBeInTheDocument();
    expect(screen.getByText("Reservas Pendentes")).toBeInTheDocument();
    expect(screen.getByText("Notificações Não Lidas")).toBeInTheDocument();
    expect(screen.getByText("Receita Estimada")).toBeInTheDocument();
  });
});
