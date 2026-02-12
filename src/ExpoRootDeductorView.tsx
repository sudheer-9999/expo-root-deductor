import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoRootDeductorViewProps } from './ExpoRootDeductor.types';

const NativeView: React.ComponentType<ExpoRootDeductorViewProps> =
  requireNativeView('ExpoRootDeductor');

export default function ExpoRootDeductorView(props: ExpoRootDeductorViewProps) {
  return <NativeView {...props} />;
}
