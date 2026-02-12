import { NativeModule, requireNativeModule } from 'expo';

import { ExpoRootDeductorModuleEvents, DetectionResult } from './ExpoRootDeductor.types';

declare class ExpoRootDeductorModule extends NativeModule<ExpoRootDeductorModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
  checkDeviceSecurity(): Promise<DetectionResult>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoRootDeductorModule>('ExpoRootDeductor');
