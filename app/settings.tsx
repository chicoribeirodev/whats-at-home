import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { removeLoggedInUserId } from '@/database';
import { Picker } from '@react-native-picker/picker';
import { useContext } from 'react';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import { AppContext } from './_layout';

export default function Settings() {
  const { user, setUser } = useContext(AppContext);

  const logout = async () => {
    await removeLoggedInUserId();
    console.log('User logged out, local database cleared.');
    setUser(null);
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
        <ThemedText style={{ fontSize: 18, fontWeight: '600' }}>User Settings</ThemedText>
        <TextInput
          placeholder="Name"
          value={user?.name ?? ''}
          onChangeText={(text) => setUser(user ? { ...user, name: text } : null)}
          style={{ backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8 }}
        />
        <TextInput
          placeholder="Email"
          value={user?.email ?? ''}
          onChangeText={(text) => setUser(user ? { ...user, email: text } : null)}
          style={{ backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8 }}
        />
        <TextInput
          placeholder="Dietary Preferences (comma separated)"
          value={user?.dietary_preferences?.join(', ') ?? ''}
          onChangeText={(text) => setUser(user ? { ...user, dietary_preferences: text.split(',').map(s => s.trim()) } : null)}
          style={{ backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8 }}
        />
        <ThemedText style={{ fontSize: 16, fontWeight: '600', marginTop: 12 }}>Language</ThemedText>
        <Picker
          selectedValue={user?.language ?? 'en-US'}
          onValueChange={(value) => setUser(user ? { ...user, language: value } : null)}
        >
          <Picker.Item label="Portuguese" value="pt-PT" />
          <Picker.Item label="English" value="en-US" />
          <Picker.Item label="Spanish" value="es-ES" />
          <Picker.Item label="French" value="fr-FR" />
        </Picker>
        <ThemedText style={{ fontSize: 16, fontWeight: '600', marginTop: 12 }}>Related Users</ThemedText>
        {user?.related_users?.map((relatedUser) => (
          <ThemedText key={relatedUser.id}>{relatedUser.name}</ThemedText>
        ))}
        {!user?.related_users || user.related_users.length === 0 ? (
          <ThemedText type="default">No related users found.</ThemedText>
        ) : null}
        <ThemedView style={styles.button} onTouchStart={logout}>
          <ThemedText style={styles.buttonText}>Logout</ThemedText>
        </ThemedView>
        <ThemedText style={{ fontSize: 18, fontWeight: '600', marginTop: 40 }}>Debug Actions</ThemedText>
        <ThemedText type="default">Use the buttons below to reset the user or clear the database for testing purposes.</ThemedText>
        {/* <ThemedView style={styles.button} onTouchStart={resetDatabase}>
          <ThemedText style={styles.buttonText}>Reset Database</ThemedText>
        </ThemedView> */}
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
