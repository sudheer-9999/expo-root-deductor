import { registerWebModule, NativeModule } from 'expo';

import { DetectionResult } from './ExpoRootDeductor.types';

class ExpoRootDeductorModule extends NativeModule {
  async checkDeviceSecurity(): Promise<DetectionResult> {
    // Web platform doesn't have access to device security features
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
  }
}

export default registerWebModule(ExpoRootDeductorModule, 'ExpoRootDeductorModule');
