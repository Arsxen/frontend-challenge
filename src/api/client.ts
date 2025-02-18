import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      queryFn: async (ctx) => {
        const lastKey = ctx.queryKey[ctx.queryKey.length - 1]
        let searchParams: string | undefined = undefined
        if (typeof lastKey === 'object') {
          searchParams = new URLSearchParams(
            lastKey as Record<string, string>,
          ).toString()
        }

        const url =
          searchParams != null
            ? `${ctx.queryKey.slice(0, ctx.queryKey.length - 1).join('/')}?${searchParams}`
            : ctx.queryKey.join('/')

        const response = await fetch(`/${url}`)

        if (!response.ok) {
          throw new Error(`Encouter error: ${await response.text()}`)
        }

        return response.json()
      },
    },
  },
})
