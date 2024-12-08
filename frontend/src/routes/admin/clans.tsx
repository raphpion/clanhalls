import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/clans')({
  component: () => <div>Hello /admin/clans!</div>
})