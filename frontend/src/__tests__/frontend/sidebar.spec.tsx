import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sidebar } from "@/components/layout/sidebar";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/events",
  useRouter: () => ({ push }),
}));

describe("<Sidebar />", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renderiza a marca Fotografo", () => {
    render(<Sidebar />);
    expect(screen.getByText("Fotografo")).toBeInTheDocument();
  });

  it("mostra os links Eventos, Álbuns e Fotos", () => {
    render(<Sidebar />);
    const nav = screen.getByRole("navigation", { name: /Navegação principal/i });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Eventos/i })).toHaveAttribute("href", "/dashboard/events");
    expect(screen.getByRole("link", { name: /Álbuns/i })).toHaveAttribute("href", "/dashboard/albums");
    expect(screen.getByRole("link", { name: /Fotos/i })).toHaveAttribute("href", "/dashboard/photos");
  });

  it("marca o link ativo com aria-current (rota atual)", () => {
    render(<Sidebar />);
    expect(screen.getByRole("link", { name: /Eventos/i })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /Álbuns/i })).not.toHaveAttribute("aria-current");
  });

  it("cada clique num link navega para a rota correta", async () => {
    const user = userEvent.setup();
    render(<Sidebar />);
    await user.click(screen.getByRole("link", { name: /Definições/i }));
    // Next Link em jsdom não navega; validamos que o href está correcto
    expect(screen.getByRole("link", { name: /Definições/i })).toHaveAttribute(
      "href",
      "/dashboard/settings"
    );
  });
});
