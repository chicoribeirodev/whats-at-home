import { CameraView, useCameraPermissions } from 'expo-camera'
import { router } from 'expo-router'
import { useContext } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { AppContext } from './_layout'

export default function BarcodeScanner() {
  const [permission, requestPermission] = useCameraPermissions()
  const { setBarcodes } = useContext(AppContext)

  if (!permission) return <View />

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission is required</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    )
  }

  return (
    <CameraView
      style={StyleSheet.absoluteFill}
      barcodeScannerSettings={{
        barcodeTypes: [
          'ean13',
          'ean8',
          'upc_a',
          'upc_e',
          'code128'
        ]
      }}
      onBarcodeScanned={({ data, type }) => {
        console.log('DATA:', data)
        setBarcodes(prev => [...prev, data])
        router.back()
      }}
    />
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
})
