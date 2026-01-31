import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateResultInput, buildUrl } from "@shared/routes";
import type { Subject } from "@shared/schema";

export function useResults() {
  return useQuery({
    queryKey: [api.results.list.path],
    queryFn: async () => {
      const res = await fetch(api.results.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch results");
      return api.results.list.responses[200].parse(await res.json());
    },
  });
}

export function useResultsBySubject(subject: Subject) {
  return useQuery({
    queryKey: [api.results.list.path, subject],
    queryFn: async () => {
      const res = await fetch(`/api/results/${subject}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch results");
      return api.results.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateResultInput) => {
      const res = await fetch(api.results.create.path, {
        method: api.results.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.results.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to save result");
      }
      
      return api.results.create.responses[201].parse(await res.json());
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: [api.results.list.path] });
      if (result.subject) {
        queryClient.invalidateQueries({ queryKey: [api.results.list.path, result.subject] });
      }
    },
  });
}

export function useClearResults() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.results.clear.path, {
        method: api.results.clear.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to clear results");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.results.list.path] });
    },
  });
}

export function useClearResultsBySubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subject: Subject) => {
      const res = await fetch(`/api/results/${subject}`, {
        method: 'DELETE',
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to clear results");
      return subject;
    },
    onSuccess: (subject) => {
      queryClient.invalidateQueries({ queryKey: [api.results.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.results.list.path, subject] });
    },
  });
}
