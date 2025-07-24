const error = ref<null | string>(null)

function setError(message: string | null) {
  error.value = message
}

export function useAlterError() {
  return {
    error: readonly(error),
    setError,
  }
}
