import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { RNCamera } from 'react-native-camera'

import { CheckInContext } from '../Constants'

export default function ScanScreen({ navigation, route }) {
  const [scanned, setScanned] = useState(false)
  let { setCheckIn } = React.useContext(CheckInContext)

  const handleBarCodeScanned = ({ type, data }) => {
    // type is different for Android and iOS
    // QR_CODE is for android
    // while org.iso.QRCode is for iOS
    if (!scanned && (type === 'QR_CODE' || type === 'org.iso.QRCode')) {
      let codeMatch = data.match('https://qrmbp.de/([c|l])/([0-9A-Z]{8})$')

      if (codeMatch) {
        setScanned(true)
        if (route.params?.onScan) {
          route.params.onScan({
            type: codeMatch[1] === 'l' ? 'LOCATION' : 'CITIZEN',
            uid: codeMatch[2],
          })
        } else {
          setCheckIn({ uid: codeMatch[2] }, codeMatch[1] === 'c')
          navigation.navigate('Home')
        }
      }
    }
  }

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        torchMode={RNCamera.Constants.FlashMode.off}
        onBarCodeRead={handleBarCodeScanned}
        captureAudio={false}>
        <View style={styles.scanOverlay} />
        <Text style={styles.description}>
          {route.params?.message ??
            'Um mit MyBodyPass einzuchecken, scannen Sie einen QR-Code eines Standorts oder einer Person ein.'}
        </Text>
      </RNCamera>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  preview: {
    flexGrow: 1,
  },
  scanOverlay: {
    borderWidth: 3,
    borderColor: 'chartreuse',
    borderRadius: 20,
    margin: 40,
    flexGrow: 1,
    flexBasis: 'auto',
  },
  description: {
    backgroundColor: 'white',
    padding: 20,
    minHeight: '40%',
    fontSize: 18,
    textAlign: 'center',
  },
})
