import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
  {
    rules: {
      'semi': ['error', 'never'],
      'no-extra-semi': 'error',
      'indent': ['error', 2],
      'eol-last': 'error',
      'func-call-spacing': 'error',
      'newline-before-return': 'error',
      'no-multi-spaces': 'error',
      'no-multiple-empty-lines': 'error',
      'space-before-blocks': 'error',
      'no-trailing-spaces': 'error',
      'template-curly-spacing': 'error',
      'constructor-super': 'error',
      'getter-return': 'error',
      'no-compare-neg-zero': 'error',
      'no-const-assign': 'error',
      'no-duplicate-imports': 'error',
      'camelcase': 'error',
      'default-case': 'error',
      'no-empty': 'error',
      'no-empty-function': 'error',
      'no-unused-expressions': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'require-await': 'error',
      'quotes': ['error', 'single'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  }
)
