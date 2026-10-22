import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { createTestQueryClient } from "../test-utils";
import { useReservations, useConfirmReservation } from "@/hooks/use-api";
import { api } from "@/lib/api";

vi.mock("@/lib/api", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/lib/api")>();
  return { ...mod, api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() } };
});

const mockedApi = vi.mocked(api);

function wrapper({ children }: { children: ReactNode }) {
  const client = createTestQueryClient();
  return createElement(QueryClientProvider, { client }, children);
}

const MOCK_RESERVATIONS = [
  { id: "r1", name: "João Silva", email: "joao@exemplo.pt", date: "2026-12-01", status: "PENDING" },
  { id: "r2", name: "Maria Costa", email: "maria@exemplo.pt", date: "2027-01-10", status: "CONFIRMED" },
];

describe("useReservations", () => {
  beforeEach(() => vi.clearAllMocks());

  it("carrega reservas do endpoint correto", async () => {
    mockedApi.get.mockResolvedValue({ data: MOCK_RESERVATIONS } as never);
    const { result } = renderHook(() => useReservations(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.get).toHaveBeenCalledWith("/reservations");
    expect(result.current.data?.filter((r) => r.status === "PENDING")).toHaveLength(1);
  });
});

describe("useConfirmReservation", () => {
  beforeEach(() => vi.clearAllMocks());

  it("envia PATCH com status CONFIRMED", async () => {
    mockedApi.patch.mockResolvedValue({ data: { ...MOCK_RESERVATIONS[0], status: "CONFIRMED" } } as never);
    const { result } = renderHook(() => useConfirmReservation(), { wrapper });
    await act(async () => { await result.current.mutateAsync("r1"); });
    expect(mockedApi.patch).toHaveBeenCalledWith("/reservations/r1", { status: "CONFIRMED" });
  });

  it("invalida a cache de reservas", async () => {
    const client = createTestQueryClient();
    const invalidate = vi.spyOn(client, "invalidateQueries");
    mockedApi.patch.mockResolvedValue({ data: {} } as never);
    const { result } = renderHook(() => useConfirmReservation(), {
      wrapper: ({ children }) => createElement(QueryClientProvider, { client }, children),
    });
    await act(async () => { await result.current.mutateAsync("r1"); });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["reservations"] });
  });
});
