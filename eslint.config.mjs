// @ts-check
import antfu from '@antfu/eslint-config'
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss'
import eslintParserVue from 'vue-eslint-parser'
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
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: eslintParserVue,
    },
  },
  {
    plugins: {
      'better-tailwindcss': eslintPluginBetterTailwindcss,
    },
    rules: {
      // enable all recommended rules to report a warning
      ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
      // enable all recommended rules to report an error
      ...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,
      // 'better-tailwindcss/no-unregistered-classes': 'off',
    },
    settings: {
      'better-tailwindcss': {
        // tailwindcss 4: the path to the entry file of the css based tailwind config (eg: `src/global.css`)
        entryPoint: 'app/assets/css/main.css',
      },
    },
  },
)
