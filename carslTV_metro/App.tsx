/**
 * Remote Input Display App for Android TV
 */

import React, { useEffect, useState } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <RemoteInputDisplay />
    </SafeAreaProvider>
  );
}

function RemoteInputDisplay() {
  const [lastInput, setLastInput] = useState<string>('Waiting for input...');
  const [inputHistory, setInputHistory] = useState<
    { key: string; action: string }[]
  >([]);

  useEffect(() => {
    // Try to get native event emitter
    const { RCTDeviceEventEmitter } = NativeModules;

    let eventEmitter: any;
    try {
      eventEmitter = new NativeEventEmitter(RCTDeviceEventEmitter);
    } catch (e) {
      console.warn('NativeEventEmitter not available', e);
    }

    let subscription: any;

    if (eventEmitter) {
      subscription = eventEmitter.addListener('onRemoteKey', (event: any) => {
        const { keyName, action } = event;

        setLastInput(keyName);
        setInputHistory(prev => [
          { key: keyName, action },
          ...prev.slice(0, 9),
        ]);
      });
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Remote Input Display</Text>
      </View>

      {/* Display Area */}
      <View style={styles.displayArea}>
        <Text style={styles.label}>Last Input:</Text>
        <View style={styles.inputBox}>
          <Text style={styles.lastInput}>{lastInput}</Text>
        </View>
      </View>

      {/* History Area */}
      <View style={styles.historyArea}>
        <Text style={styles.label}>Input History:</Text>
        <View style={styles.historyList}>
          {inputHistory.length > 0 ? (
            inputHistory.map((input, index) => (
              <Text key={index} style={styles.historyItem}>
                {index + 1}. {input.key} [{input.action}]
              </Text>
            ))
          ) : (
            <Text style={styles.emptyHistory}>No inputs yet</Text>
          )}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Press keys on your remote to see them displayed
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  displayArea: {
    marginBottom: 50,
  },
  label: {
    fontSize: 28,
    color: '#888',
    marginBottom: 12,
    fontWeight: '600',
  },
  inputBox: {
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 30,
    borderWidth: 3,
    borderColor: '#00d9ff',
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastInput: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#00d9ff',
    textAlign: 'center',
  },
  historyArea: {
    flex: 1,
    marginBottom: 30,
  },
  historyList: {
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#333',
    flex: 1,
  },
  historyItem: {
    fontSize: 20,
    color: '#00d9ff',
    paddingVertical: 8,
    fontFamily: 'monospace',
  },
  emptyHistory: {
    fontSize: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerText: {
    fontSize: 18,
    color: '#666',
  },
});

export default App;
