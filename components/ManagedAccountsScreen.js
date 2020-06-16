import * as React from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import Colors from '../Colors'
import ManagedAccountsList from './ManagedAccountsList'
import UserAPIService from '../src/services/api/UserAPIService'

export default function ManagedAccountsScreen({ navigation }) {
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    // Update list every time the screen gets opened!
    const unsubscribe = navigation.addListener('focus', () => {
      UserAPIService.getManagedAccounts()
        .then(accounts => {
          return accounts.json()
        })
        .then(json => {
          setData(json)
        })
    })

    return unsubscribe
  }, [navigation])

  return (
    <View style={styles.container}>
      <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginBottom: 10 }} />
      <View style={[styles.managedAccountsContainer, styles.grow]}>
        <Text style={styles.managedAccountsHeading}>Mit Ihrem Account verknüpfte MyBodyPass Cards</Text>
        <ManagedAccountsList navigation={navigation} accounts={data} />
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
})
