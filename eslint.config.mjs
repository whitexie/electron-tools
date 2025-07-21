// @ts-check
import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default await nuxt(
  antfu(
    {
      vue: {
        overrides: {
          'vue/no-extra-parens': 'off',
          'vue/multi-word-component-names': 'off',
        },
      },

      typescript: true,
      pnpm: true,

      rules: {
        // Allow console statements in development
        'no-console': 'warn',

        // TypeScript rules
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/ban-ts-comment': 'warn',
      },
    },
  ),
)
