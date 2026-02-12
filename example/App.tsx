import { useEvent } from 'expo';
import ExpoRootDeductor, { ExpoRootDeductorView } from 'expo-root-deductor';
import { Button, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useState } from 'react';

export default function App() {
  const onChangePayload = useEvent(ExpoRootDeductor, 'onChange');
  const [securityResult, setSecurityResult] = useState<any>(null);

  const checkSecurity = async () => {
    try {
      const result = await ExpoRootDeductor.checkDeviceSecurity();
      setSecurityResult(result);
    } catch (error) {
      console.error('Security check failed:', error);
      setSecurityResult({ error: String(error) });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        <Group name="Device Security Check">
          <Button
            title="Check Device Security"
            onPress={checkSecurity}
          />
          {securityResult && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>
                Is Compromised: {securityResult.isCompromised ? 'YES' : 'NO'}
              </Text>
              {securityResult.failedChecks && securityResult.failedChecks.length > 0 && (
                <>
                  <Text style={styles.resultText}>
                    Failed Checks:
                  </Text>
                  {securityResult.failedChecks.map((check: string, index: number) => (
                    <Text key={index} style={styles.failedCheck}>
                      • {check}
                    </Text>
                  ))}
                </>
              )}
              {securityResult.details && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.resultText}>Details:</Text>
                  <Text style={styles.detailText}>
                    Rooted: {securityResult.details.isRooted ? 'Yes' : 'No'}
                  </Text>
                  <Text style={styles.detailText}>
                    Developer Mode: {securityResult.details.isDeveloperMode ? 'Yes' : 'No'}
                  </Text>
                  <Text style={styles.detailText}>
                    Developer Options: {securityResult.details.isDeveloperOptionsEnabled ? 'Yes' : 'No'}
                  </Text>
                  <Text style={styles.detailText}>
                    Emulator/Simulator: {securityResult.details.isEmulator ? 'Yes' : 'No'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </Group>
        <Group name="Constants">
          <Text>{ExpoRootDeductor.PI}</Text>
        </Group>
        <Group name="Functions">
          <Text>{ExpoRootDeductor.hello()}</Text>
        </Group>
        <Group name="Async functions">
          <Button
            title="Set value"
            onPress={async () => {
              await ExpoRootDeductor.setValueAsync('Hello from JS!');
            }}
          />
        </Group>
        <Group name="Events">
          <Text>{onChangePayload?.value}</Text>
        </Group>
        <Group name="Views">
          <ExpoRootDeductorView
            url="https://www.example.com"
            onLoad={({ nativeEvent: { url } }) => console.log(`Loaded: ${url}`)}
            style={styles.view}
          />
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  view: {
    flex: 1,
    height: 200,
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  failedCheck: {
    fontSize: 14,
    color: '#d32f2f',
    marginLeft: 10,
    marginBottom: 5,
  },
  detailsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  detailText: {
    fontSize: 14,
    marginBottom: 5,
  },
};
