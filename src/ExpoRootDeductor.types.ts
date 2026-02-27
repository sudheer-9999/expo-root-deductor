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
