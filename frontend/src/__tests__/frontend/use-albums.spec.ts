import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { createTestQueryClient } from "../test-utils";
import { useAlbums, useCreateAlbum, useDeleteAlbum } from "@/hooks/use-api";
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

const MOCK_ALBUMS = [
  { id: "a1", name: "Casamento — Cerimónia", eventId: "e1" },
  { id: "a2", name: "Casamento — Festa", eventId: "e1" },
];

describe("useAlbums", () => {
  beforeEach(() => vi.clearAllMocks());

  it("lista todos os álbuns", async () => {
    mockedApi.get.mockResolvedValue({ data: MOCK_ALBUMS } as never);
    const { result } = renderHook(() => useAlbums(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.get).toHaveBeenCalledWith("/albums", { params: {} });
    expect(result.current.data).toHaveLength(2);
  });

  it("filtra por eventId", async () => {
    mockedApi.get.mockResolvedValue({ data: MOCK_ALBUMS } as never);
    const { result } = renderHook(() => useAlbums("e1"), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.get).toHaveBeenCalledWith("/albums", { params: { eventId: "e1" } });
  });
});

describe("useCreateAlbum", () => {
  beforeEach(() => vi.clearAllMocks());

  it("faz POST /albums e invalida a cache", async () => {
    const client = createTestQueryClient();
    const invalidate = vi.spyOn(client, "invalidateQueries");
    mockedApi.post.mockResolvedValue({ data: MOCK_ALBUMS[0] } as never);
    const { result } = renderHook(() => useCreateAlbum(), {
      wrapper: ({ children }) => createElement(QueryClientProvider, { client }, children),
    });
    await act(async () => {
      await result.current.mutateAsync({ name: "Novo Álbum", eventId: "e1" });
    });
    expect(mockedApi.post).toHaveBeenCalledWith("/albums", { name: "Novo Álbum", eventId: "e1" });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["albums"] });
  });
});

describe("useDeleteAlbum", () => {
  beforeEach(() => vi.clearAllMocks());

  it("faz DELETE /albums/:id", async () => {
    mockedApi.delete.mockResolvedValue({ data: {} } as never);
    const { result } = renderHook(() => useDeleteAlbum(), { wrapper });
    await act(async () => { await result.current.mutateAsync("a1"); });
    expect(mockedApi.delete).toHaveBeenCalledWith("/albums/a1");
    expect(result.current.isSuccess).toBe(true);
  });

  it("falha graciosamente com erro de rede", async () => {
    mockedApi.delete.mockRejectedValue(new Error("sem ligação"));
    const { result } = renderHook(() => useDeleteAlbum(), { wrapper });
    await act(async () => {
      await expect(result.current.mutateAsync("x")).rejects.toThrow("sem ligação");
    });
    expect(result.current.isError).toBe(true);
  });
});
