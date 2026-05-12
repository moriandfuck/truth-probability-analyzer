import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useApiKeys() {
  const queryClient = useQueryClient()

  const keysQuery = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const res = await fetch('/api/config/keys')
      const data = await res.json()
      return data.keys as Record<string, string>
    },
  })

  const setKeyMutation = useMutation({
    mutationFn: async ({ provider, key }: { provider: string; key: string }) => {
      const res = await fetch('/api/config/keys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, key }),
      })
      if (!res.ok) throw new Error('Failed to save key')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-keys'] }),
  })

  const deleteKeyMutation = useMutation({
    mutationFn: async (provider: string) => {
      const res = await fetch(`/api/config/keys/${provider}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete key')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-keys'] }),
  })

  return { keysQuery, setKeyMutation, deleteKeyMutation }
}
