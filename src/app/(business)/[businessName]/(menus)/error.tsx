"use client"

export default function error({
    error,
    reset,
  }: {
    error: Error & { digest?: string }
    reset: () => void
  }) {
  return (
    <div className="min-h-screen flex-center text-xl">{error.message}</div>
  )
}
