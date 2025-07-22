export default defineAppConfig({
  // App metadata
  name: 'Electron Icon Converter',
  description: 'Convert images to Electron app icons for Windows, macOS, and Linux',
  version: '1.0.0',

  // UI configuration
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'zinc',
    },
    notifications: {
      position: 'top-right',
    },
  },
})
