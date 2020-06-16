import React from 'react'
import { StyleSheet, View, Text, Dimensions, ActivityIndicator } from 'react-native'

import QRCode from 'react-native-qrcode-svg'
import UserAPIService from '../src/services/api/UserAPIService'

export default function ProfileScreen() {
  const dimensions = Dimensions.get('window')

  const [userCodeTitle, setCodeTitle] = React.useState(null)
  const [userCode, setCode] = React.useState(null)

  React.useEffect(() => {
    UserAPIService.getProfile().then(userData => {
      //let c = userData.uid.substring(0, 4) + '-' + userData.uid.substring(4, 8)
      //setCodeTitle(c)
      setCode('https://qrmbp.de/c/' + userData.uid)
    })
  }, [])

  return (
    <View style={styles.code}>
      {userCode != null ? (
        <>
          <QRCode value={userCode} style={styles.qrCode} size={dimensions.width / 2} />
          <Text style={styles.userCode}>{userCodeTitle}</Text>
        </>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  code: {
    alignItems: 'center',
    marginVertical: 20,
  },
  qrCode: {
    flexGrow: 1,
    width: '50%',
  },
  userCode: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'courier',
  },
})
