import * as React from 'react'
import { StyleSheet, View, Alert, Text, Dimensions } from 'react-native'
import Colors from '../Colors'

import UserAPIService from '../src/services/api/UserAPIService'
import CheckIns from './CheckIns'
import CheckInService from '../src/services/api/CheckInService'
import { CheckInContext } from '../Constants'

const statusName = {
  GREY: 'unbekannt',
  GREEN: 'Grün (Alles in Ordnung)',
  GREEN_PERMANENT: 'Grün (dauerhaft)',
  VIOLET: 'Lila (Ungesicherter Kontakt)',
  YELLOW: 'Gelb (Sicherer Kontakt)',
  RED: 'Rot (Bestätigt)',
  RED_SELF: 'Rot (Selbsteinschätzung)',
}

export default function ManagedAccountDetails({ navigation, route }) {
  const [checkIns, setCheckIns] = React.useState([])
  const [user, setUser] = React.useState({})
  let { setCheckIn } = React.useContext(CheckInContext)

  React.useEffect(() => {
    UserAPIService.getManagedUserProfile(route.params.uid).then(setUser)
    CheckInService.listManagedAccountCheckIns(route.params.uid).then(setCheckIns)
  }, [route.params.uid])

  const handleCheckOut = async ({ uid, hostUid }) => {
    if (uid !== null && uid !== undefined) {
      // if the item id is valid

      try {
        setCheckIn({ uid, host: user.uid })
          .then(result => {
            console.log(result)
            //this.getCheckIns()
          })
          .catch(error => console.log(error))
      } catch (error) {
        Alert.alert('Fehler beim Auschecken', error)
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.profileInfo]}>
        <View style={styles.category}>
          <Text style={styles.infoCategory}>Benutzername</Text>
          <Text style={styles.info}>{user.username}</Text>
        </View>
        <View style={styles.category}>
          <Text style={styles.infoCategory}>Name</Text>
          <Text style={styles.info}>{user.name}</Text>
        </View>
        <View style={styles.category}>
          <Text style={styles.infoCategory}>Aktueller Status</Text>
          <View
            style={[
              styles.statusIndicator,
              styles[
                'status' +
                  user.medicalStatus
                    ?.toLowerCase()
                    .replace(/_/, c => '')
                    .replace(/^\w/, c => c.toUpperCase())
              ],
            ]}
          />
          <Text style={styles.info}>{statusName[user.medicalStatus]}</Text>
        </View>
      </View>

      <View>
        <CheckIns navigation={navigation} list={checkIns} handleCheckOut={handleCheckOut} checkoutEnabled={false} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    maxHeight: Dimensions.get('window').height - 80,
    backgroundColor: 'white',
  },
  infoCategory: {
    color: Colors.primaryColor,
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 120,
  },
  info: {
    fontSize: 14,
    marginBottom: 10,
    flexGrow: 1,
    marginLeft: 5,
  },
  profileInfo: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: 'white',
  },
  appVersion: {
    color: '#aaa',
    flexGrow: 1,
    textAlign: 'right',
  },
  category: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  managedAccountsContainer: {
    flexShrink: 1,
  },
  managedAccountsHeading: {
    color: Colors.primaryColor,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  grow: {
    flexGrow: 1,
  },
  statusIndicator: {
    backgroundColor: '#4caf50',
    borderColor: '#197c20',
    borderWidth: 1,
    minWidth: 26,
    minHeight: 26,
    borderRadius: 13,
  },
  statusGreen: {
    backgroundColor: '#4caf50',
    borderColor: '#197c20',
    borderWidth: 1,
  },
  statusGreenpermanent: {
    backgroundColor: '#4caf50',
    borderColor: '#197c20',
    borderWidth: 1,
  },
  statusYellow: {
    backgroundColor: '#f9a825',
    borderColor: '#c67502',
    borderWidth: 1,
  },
  statusViolet: {
    backgroundColor: '#ab47bc',
    borderColor: '#781489',
    borderWidth: 1,
  },
  statusRed: {
    backgroundColor: '#e53935',
    borderColor: '#b20612',
    borderWidth: 1,
  },
  statusRedself: {
    backgroundColor: '#e53935',
    borderColor: '#b20612',
    borderWidth: 1,
  },
})
