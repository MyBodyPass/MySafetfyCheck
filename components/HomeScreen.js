import * as React from 'react'
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { CheckInContext } from '../Constants'

export default function HomeScreen({ navigation }) {
  const onPress = () => {
    navigation.navigate('scan')
  }

  const { checkIn } = React.useContext(CheckInContext)

  return (
    <View style={styles.container}>
      {checkIn ? (
        <View style={styles.lastCheckin}>
          <Text style={styles.checkinTitle}>
            {checkIn.type === 'CITIZEN'
              ? 'Mit einer Person verbunden'
              : (checkIn.event === 'CHECKIN' ? 'Aktuell eingecheckt bei ' : 'Ausgecheckt von ') + checkIn.name}
          </Text>
        </View>
      ) : null}

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeContainer}>
          <Image source={require('../assets/images/mybodypass.jpg')} style={styles.welcomeImage} />
        </View>

        <View style={styles.list}>
          <View style={styles.columnLeft}>
            <TouchableOpacity onPress={onPress} style={styles.item} activeOpacity={0.2}>
              <MaterialCommunityIcons name="qrcode-scan" size={40} />
              <Text style={styles.title}>QR-Code scannen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('scan_friend')
              }}
              style={styles.item}>
              <MaterialCommunityIcons name="account-multiple-check" size={40} />
              <Text style={styles.title}>Mein QR-Code anzeigen</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.columnRight}>
            {/*<TouchableOpacity
              onPress={() => {
                navigation.navigate('survey')
              }}
              style={styles.item}
              activeOpacity={0.2}>
              <MaterialCommunityIcons name="clipboard-check-outline" size={40} />
              <Text style={styles.title}>Selbsttest durchführen</Text>
            </TouchableOpacity>*/}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('checkin-list')
              }}
              style={styles.item}>
              <MaterialCommunityIcons name="playlist-check" size={40} />
              <Text style={styles.title}>Meine Check-Ins</Text>
            </TouchableOpacity>
            {/*<TouchableOpacity
              onPress={() => {
                navigation.navigate('functions')
              }}
              style={styles.item}
              activeOpacity={0.2}>
              <MaterialCommunityIcons name="arrow-right-thick" size={40} />
              <Text style={styles.title}>Weitere Funktionen</Text>
            </TouchableOpacity>*/}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('update-account-status')
              }}
              style={styles.item}
              activeOpacity={0.2}>
              <MaterialIcons name="check-circle" size={40} />
              <Text style={styles.title}>Eigenen Status setzen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('managed-accounts')
              }}
              style={styles.item}
              activeOpacity={0.2}>
              <MaterialCommunityIcons name="account-card-details-outline" size={40} />
              <Text style={styles.title}>MyBodyPass Cards</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 0,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  welcomeImage: {
    maxWidth: 300,
    width: '70%',
    resizeMode: 'contain',
    height: 80,
  },
  lastCheckin: {
    backgroundColor: '#57b460',
    padding: 10,
    color: 'white',
    bottom: 0,
    right: 0,
    left: 0,
    borderColor: '#006e1f',
    borderTopWidth: 0,
    position: 'absolute',
    zIndex: 100,
  },
  checkinTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: 10,
  },
  columnLeft: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    width: '50%',
  },
  columnRight: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    width: '50%',
  },
  item: {
    marginRight: 10,
    marginBottom: 20,
    marginLeft: 10,
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    height: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 200,
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
})
