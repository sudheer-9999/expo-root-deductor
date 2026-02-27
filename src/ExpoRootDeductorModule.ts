import { NativeModule, requireNativeModule } from 'expo';
import { Platform } from 'react-native';

import { DetectionResult } from './ExpoRootDeductor.types';

declare class ExpoRootDeductorModule extends NativeModule {
  checkDeviceSecurity(): Promise<DetectionResult>;
}

const NoopModule = {
  async checkDeviceSecurity(): Promise<DetectionResult> {
    return {
      isCompromised: false,
      failedChecks: [],
      details: {
        isRooted: false,
        isDeveloperMode: false,
        isDeveloperOptionsEnabled: false,
        isEmulator: false,
      },
    };
  },
} as unknown as ExpoRootDeductorModule;

// Only load the native module on Android where it's available.
// On iOS/web, return a no-op stub to avoid crashing from requireNativeModule.
export default Platform.OS === 'android'
  ? requireNativeModule<ExpoRootDeductorModule>('ExpoRootDeductor')
  : NoopModule;
