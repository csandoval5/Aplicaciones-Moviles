import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.feedmanager.app',
  appName: 'feedmanager',
  webDir: 'webview',
  server: {
    androidScheme: 'https'
  }
};

export default config;
