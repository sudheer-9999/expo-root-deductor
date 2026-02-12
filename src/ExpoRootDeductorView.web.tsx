import * as React from 'react';

import { ExpoRootDeductorViewProps } from './ExpoRootDeductor.types';

export default function ExpoRootDeductorView(props: ExpoRootDeductorViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
