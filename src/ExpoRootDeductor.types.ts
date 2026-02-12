import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type ExpoRootDeductorModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type DetectionResult = {
  isCompromised: boolean;
  failedChecks: string[];
  details: {
    isRooted: boolean;
    isDeveloperMode: boolean;
    isDeveloperOptionsEnabled: boolean;
    isEmulator: boolean;
  };
};

export type ExpoRootDeductorViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
