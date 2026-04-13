import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { setLoggedInUserId } from '@/database/local-database';
import { getUserByEmail } from '@/database/remote-database';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import { AppContext } from './_layout';

export default function Settings() {
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useContext(AppContext);

  const login = async () => {
    console.log('Login attempt with email:', email);

    const user = await getUserByEmail(email);

    console.log('User fetched from remote database:', user);

    if (user) {
      await setLoggedInUserId(user.id);
      setUser(user);
      console.log('User logged in, local database updated with user ID:', user.id);
      router.replace('/'); // Navigate to the main app screen after login
    } else {
      console.error('No user found with that email.');
      setError('No user found with that email. Please try again.');
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingTop: 20,
        paddingHorizontal: 16,
        minHeight: '100%',
        gap: 16,
        backgroundColor: "white",
      }}
    >
      <ThemedView style={styles.stepContainer}>
        <ThemedText style={{ fontSize: 18, fontWeight: '600' }}>Login</ThemedText>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{ backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8 }}
        />
        <ThemedView style={styles.button} onTouchStart={login}>
          <ThemedText style={styles.buttonText}>Login</ThemedText>
        </ThemedView>
        {error && <ThemedText style={{ color: 'red', marginTop: 8 }}>{error}</ThemedText>}
        <ThemedText style={{ fontSize: 18, fontWeight: '600', marginTop: 40 }}>Debug Actions</ThemedText>
        <ThemedText type="default">Use the buttons below to reset the user or clear the database for testing purposes.</ThemedText>
        {/* <ThemedView style={styles.button} onTouchStart={resetDatabase}>
                  <ThemedText style={styles.buttonText}>Reset Database</ThemedText>
                </ThemedView> */}
        <ThemedView style={styles.button} onTouchStart={() => setShowUserInfo(!showUserInfo)}>
          <ThemedText style={styles.buttonText}>Show User</ThemedText>
        </ThemedView>
        {showUserInfo && (
          <ThemedText type="default">Current user: {JSON.stringify(user, null, 2)}</ThemedText>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  productCard: {
    width: '48%',
    marginTop: 12,
  },
  productImage: {
    width: '100%',
    height: 100,
    marginTop: 4,
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  recipeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  recipeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
});
