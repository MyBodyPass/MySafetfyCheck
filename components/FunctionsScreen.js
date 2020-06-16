import React from 'react'
import { StyleSheet, SafeAreaView, FlatList, Text, TouchableOpacity, Linking, Alert } from 'react-native'

import { configuration } from '../Constants'

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Bluetooth-Tracking freischalten',
    enabled: false,
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Eigene QR-Codes erstellen',
    onClick: () => {
      Linking.openURL(configuration.locationsServer + '?utm_source=app&utm_medium=mbp&utm_campaign=create_own_qr_code')
    },
    enabled: true,
  },
]

function Item({ title, onPress, enabled }) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        enabled ? onPress() : Alert.alert('Funktion nicht verfügbar', 'Diese Funktion wird bald freigeschaltet')
      }}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  )
}

export default function FunctionsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} onPress={item.onClick} enabled={item.enabled} />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  item: {
    minHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
  },
})
