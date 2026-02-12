import { registerWebModule, NativeModule } from 'expo';

import { ExpoRootDeductorModuleEvents, DetectionResult } from './ExpoRootDeductor.types';

class ExpoRootDeductorModule extends NativeModule<ExpoRootDeductorModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
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
