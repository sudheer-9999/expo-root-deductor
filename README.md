# expo-root-deductor

A comprehensive Expo module for detecting device security compromises including root/jailbreak detection, developer mode checks, and emulator detection on iOS and Android platforms.

## Features

- 🔒 **Root/Jailbreak Detection**: Detects if the device is rooted (Android) or jailbroken (iOS)
- 🛠️ **Developer Mode Detection**: Checks if developer mode is enabled
- ⚙️ **Developer Options Detection**: Detects if developer options are enabled
- 📱 **Emulator Detection**: Identifies if the app is running on an emulator or simulator
- 🌐 **Web Support**: Includes web platform support with appropriate fallbacks
- 📊 **Detailed Results**: Returns comprehensive security check results with failed check indicators

## Installation

### Managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, please follow the installation instructions in the [API documentation for the latest stable release](#api-documentation). If you follow the link and there is no documentation available then this library is not yet usable within managed projects &mdash; it is likely to be included in an upcoming Expo SDK release.

### Bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

#### Add the package to your npm dependencies

```bash
npm install expo-root-deductor
```

#### Configure for Android

No additional configuration needed. The module will automatically detect root status and developer options.

#### Configure for iOS

Run `npx pod-install` after installing the npm package.

```bash
cd ios
npx pod-install
```

## Usage

### Basic Example

```typescript
import ExpoRootDeductor from 'expo-root-deductor';

// Check device security
const checkSecurity = async () => {
  try {
    const result = await ExpoRootDeductor.checkDeviceSecurity();
    
    console.log('Is Compromised:', result.isCompromised);
    console.log('Failed Checks:', result.failedChecks);
    console.log('Details:', result.details);
    
    if (result.isCompromised) {
      // Handle compromised device
      console.warn('Device security compromised!');
    }
  } catch (error) {
    console.error('Security check failed:', error);
  }
};
```

### Complete Example with React Hook

```typescript
import { useEvent } from 'expo';
import ExpoRootDeductor from 'expo-root-deductor';
import { useState } from 'react';

export default function SecurityCheck() {
  const [securityResult, setSecurityResult] = useState(null);

  const checkSecurity = async () => {
    try {
      const result = await ExpoRootDeductor.checkDeviceSecurity();
      setSecurityResult(result);
    } catch (error) {
      console.error('Security check failed:', error);
    }
  };

  return (
    <View>
      <Button title="Check Device Security" onPress={checkSecurity} />
      
      {securityResult && (
        <View>
          <Text>
            Is Compromised: {securityResult.isCompromised ? 'YES' : 'NO'}
          </Text>
          
          {securityResult.failedChecks?.length > 0 && (
            <View>
              <Text>Failed Checks:</Text>
              {securityResult.failedChecks.map((check, index) => (
                <Text key={index}>• {check}</Text>
              ))}
            </View>
          )}
          
          <Text>
            Rooted: {securityResult.details?.isRooted ? 'Yes' : 'No'}
          </Text>
          <Text>
            Developer Mode: {securityResult.details?.isDeveloperMode ? 'Yes' : 'No'}
          </Text>
          <Text>
            Developer Options: {securityResult.details?.isDeveloperOptionsEnabled ? 'Yes' : 'No'}
          </Text>
          <Text>
            Emulator: {securityResult.details?.isEmulator ? 'Yes' : 'No'}
          </Text>
        </View>
      )}
    </View>
  );
}
```

## API Reference

### Methods

#### `checkDeviceSecurity(): Promise<DetectionResult>`

Performs comprehensive security checks on the device and returns detailed results.

**Returns:** `Promise<DetectionResult>`

**DetectionResult:**
```typescript
type DetectionResult = {
  isCompromised: boolean;           // True if any security check failed
  failedChecks: string[];            // Array of failed check names
  details: {
    isRooted: boolean;               // True if device is rooted/jailbroken
    isDeveloperMode: boolean;        // True if developer mode is enabled
    isDeveloperOptionsEnabled: boolean; // True if developer options are enabled
    isEmulator: boolean;              // True if running on emulator/simulator
  };
};
```

**Example:**
```typescript
const result = await ExpoRootDeductor.checkDeviceSecurity();
// {
//   isCompromised: true,
//   failedChecks: ['isRooted', 'isDeveloperOptionsEnabled'],
//   details: {
//     isRooted: true,
//     isDeveloperMode: false,
//     isDeveloperOptionsEnabled: true,
//     isEmulator: false
//   }
// }
```

#### `hello(): string`

Returns a greeting message. Useful for testing module integration.

**Returns:** `string`

**Example:**
```typescript
const greeting = ExpoRootDeductor.hello();
// "Hello world! 👋"
```

#### `setValueAsync(value: string): Promise<void>`

Sets a value and triggers an onChange event.

**Parameters:**
- `value: string` - The value to set

**Example:**
```typescript
await ExpoRootDeductor.setValueAsync('Hello from JS!');
```

### Constants

#### `PI: number`

The mathematical constant π (pi).

**Example:**
```typescript
const pi = ExpoRootDeductor.PI;
// 3.141592653589793
```

### Events

#### `onChange`

Event fired when a value changes via `setValueAsync`.

**Event Payload:**
```typescript
type ChangeEventPayload = {
  value: string;
};
```

**Example:**
```typescript
import { useEvent } from 'expo';

const onChangePayload = useEvent(ExpoRootDeductor, 'onChange');
console.log(onChangePayload?.value);
```

### Views

#### `ExpoRootDeductorView`

A view component that displays a web view.

**Props:**
```typescript
type ExpoRootDeductorViewProps = {
  url: string;                      // URL to load in the web view
  onLoad?: (event: { nativeEvent: { url: string } }) => void; // Callback when URL loads
  style?: StyleProp<ViewStyle>;      // Optional style prop
};
```

**Example:**
```typescript
import { ExpoRootDeductorView } from 'expo-root-deductor';

<ExpoRootDeductorView
  url="https://www.example.com"
  onLoad={({ nativeEvent: { url } }) => console.log(`Loaded: ${url}`)}
  style={{ height: 200 }}
/>
```

## Platform Support

- ✅ iOS
- ✅ Android
- ✅ Web (with appropriate fallbacks)

## Security Considerations

⚠️ **Important**: This module provides security detection capabilities, but it should not be the sole security measure for your application. Determined attackers may find ways to bypass these checks. Always implement multiple layers of security.

### Limitations

- Root/jailbreak detection can be bypassed by sophisticated root cloaking tools
- Some checks may have false positives or false negatives
- Web platform has limited detection capabilities

## Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide](https://github.com/expo/expo#contributing).

## License

MIT

## Author

sudheer-9999 - [GitHub](https://github.com/sudheer-9999)

## Repository

[GitHub Repository](https://github.com/sudheer-9999/expo-root-deductor)

## Issues

[Report Issues](https://github.com/sudheer-9999/expo-root-deductor/issues)
