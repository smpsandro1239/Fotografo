import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createElement } from "react";
import { createTestQueryClient } from "../test-utils";
import { useEvents, useCreateEvent, usePublishEvent } from "@/hooks/use-api";
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

const MOCK_EVENTS = [
  { id: "1", name: "Casamento Ana & Rui", date: "2026-11-01T10:00:00Z", isPublic: false },
  { id: "2", name: "Batizado Martim", date: "2026-12-15T14:00:00Z", isPublic: true },
];

describe("useEvents", () => {
  beforeEach(() => vi.clearAllMocks());

  it("faz GET /events e devolve a lista", async () => {
    mockedApi.get.mockResolvedValue({ data: MOCK_EVENTS } as never);
    const { result } = renderHook(() => useEvents(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.get).toHaveBeenCalledWith("/events");
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0].name).toBe("Casamento Ana & Rui");
  });

  it("permite refetch com fresh data", async () => {
    mockedApi.get
      .mockResolvedValueOnce({ data: MOCK_EVENTS } as never)
      .mockResolvedValueOnce({ data: [...MOCK_EVENTS, { id: "3", name: "Novo", date: "2027-01-01", isPublic: false }] } as never);
    const { result } = renderHook(() => useEvents(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await act(async () => { await result.current.refetch(); });
    expect(result.current.data).toHaveLength(3);
    expect(mockedApi.get).toHaveBeenCalledTimes(2);
  });
});

describe("useCreateEvent", () => {
  beforeEach(() => vi.clearAllMocks());

  it("faz POST /events com os dados do formulário", async () => {
    mockedApi.post.mockResolvedValue({ data: MOCK_EVENTS[0] } as never);
    const { result } = renderHook(() => useCreateEvent(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync({ name: "Evento Teste" });
    });
    expect(mockedApi.post).toHaveBeenCalledWith("/events", { name: "Evento Teste" });
    expect(result.current.isSuccess).toBe(true);
  });

  it("invalida a cache de eventos após sucesso", async () => {
    const client = createTestQueryClient();
    const invalidate = vi.spyOn(client, "invalidateQueries");
    mockedApi.post.mockResolvedValue({ data: {} } as never);
    const { result } = renderHook(() => useCreateEvent(), {
      wrapper: ({ children }) => createElement(QueryClientProvider, { client }, children),
    });
    await act(async () => { await result.current.mutateAsync({ name: "X" }); });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["events"] });
  });
});

describe("usePublishEvent", () => {
  beforeEach(() => vi.clearAllMocks());

  it("faz PATCH /events/:id/publish", async () => {
    mockedApi.patch.mockResolvedValue({ data: { ...MOCK_EVENTS[0], isPublic: true } } as never);
    const { result } = renderHook(() => usePublishEvent(), { wrapper });
    await act(async () => { await result.current.mutateAsync("1"); });
    expect(mockedApi.patch).toHaveBeenCalledWith("/events/1/publish");
    expect(result.current.isSuccess).toBe(true);
  });

  it("reporta erro quando o backend falha", async () => {
    mockedApi.patch.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => usePublishEvent(), { wrapper });
    await act(async () => {
      await expect(result.current.mutateAsync("999")).rejects.toThrow("boom");
    });
    expect(result.current.isError).toBe(true);
  });
});
