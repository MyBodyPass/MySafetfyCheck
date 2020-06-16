import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Button from './Button'

import Colors from '../Colors'
import ProfileCode from './ProfileCode'

export default function ScanFriend({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Lassen Sie Ihren Code von einem Anderen scannen um sich mit ihm zu verbinden.
      </Text>
      <ProfileCode />
      <Button
        title="Ich möchte einen Code scannen"
        color={Colors.primaryColor}
        onPress={() => {
          navigation.navigate('scan')
        }}
        type="secondary"
      />
      <Button
        title="Code für Gästeliste anzeigen"
        color={Colors.primaryColor}
        onPress={() => {
          navigation.navigate('guestData')
        }}
        style={styles.button}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 20,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    marginTop: 20,
  },
})
