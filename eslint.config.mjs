// @ts-check
import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default await nuxt(
  antfu(
    {
      vue: true,
      typescript: true,
      pnpm: true,

      rules: {
        // Allow console statements in development
        'no-console': 'warn',

        // TypeScript rules
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/ban-ts-comment': 'warn',
      },
    },
  ),
)
