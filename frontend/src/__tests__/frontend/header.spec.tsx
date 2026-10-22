import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/header";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ push }),
}));

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: { id: "u1", email: "ana@fotografo.pt", name: "Ana Ferreira", role: "PHOTOGRAPHER" },
    logout: vi.fn().mockResolvedValue(undefined),
  }),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: vi.fn() }),
}));

describe("<Header />", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renderiza o botão hamburger com aria-label (mobile)", () => {
    render(<Header title="Dashboard" />);
    expect(screen.getByRole("button", { name: /Abrir menu de navegação/i })).toBeInTheDocument();
  });

  it("tem o sino de notificações acessível", () => {
    render(<Header />);
    expect(screen.getByRole("button", { name: /Notificações/i })).toBeInTheDocument();
  });

  it("clicar no sino navega para /dashboard/notifications", async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole("button", { name: /Notificações/i }));
    expect(push).toHaveBeenCalledWith("/dashboard/notifications");
  });

  it("dropdown do utilizador mostra nome, papel e logout", async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole("button", { name: /Menu do utilizador/i }));
    expect(await screen.findByText("Ana Ferreira")).toBeInTheDocument();
    expect(screen.getByText("PHOTOGRAPHER")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Terminar sessão/i })).toBeInTheDocument();
  });

  it("iniciais do avatar derivam do nome (AF)", () => {
    render(<Header />);
    expect(screen.getByText("AF")).toBeInTheDocument();
  });
});
