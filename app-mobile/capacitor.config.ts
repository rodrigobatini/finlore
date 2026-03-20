import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.finance.news',
  appName: 'Finance News',
  webDir: 'web-client/dist',
  server: {
    androidScheme: 'https'
  }
}

export default config
