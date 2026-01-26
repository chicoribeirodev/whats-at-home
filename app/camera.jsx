import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Button, StyleSheet, View } from 'react-native';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Button title="Grant Camera Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} />
      <View style={styles.buttonContainer}>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  buttonContainer: { padding: 16 },
});