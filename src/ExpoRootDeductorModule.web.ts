import { registerWebModule, NativeModule } from 'expo';

import { ExpoRootDeductorModuleEvents } from './ExpoRootDeductor.types';

class ExpoRootDeductorModule extends NativeModule<ExpoRootDeductorModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoRootDeductorModule, 'ExpoRootDeductorModule');
