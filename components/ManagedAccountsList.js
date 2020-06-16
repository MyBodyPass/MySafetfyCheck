import React from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import Button from './TextButton'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

const ManagedAccountsList = ({ navigation, accounts }) => {
  const addAccount = nav => {
    nav.navigate('add-account')
  }

  return (
    <FlatList
      data={accounts}
      renderItem={({ item }) => (
        <Item uid={item.managedCitizenUid} name={item.managedCitizenName} navigation={navigation} />
      )}
      keyExtractor={item => item.managedCitizenUid}
      ItemSeparatorComponent={() => {
        return <View style={{ borderBottomColor: '#cccccc', borderBottomWidth: 1 }} />
      }}
      ListEmptyComponent={() => {
        return <Text style={{ marginHorizontal: 20 }}>Sie haben derzeit noch keine verknüpften MyBodyPass Cards.</Text>
      }}
      ListFooterComponent={() => {
        return (
          <Button
            title={
              <>
                <MaterialCommunityIcons name="plus" size={20} />
                <Text>MyBodyPass Card hinzufügen</Text>
              </>
            }
            type="secondary"
            onPress={() => {
              addAccount(navigation)
            }}
          />
        )
      }}
    />
  )
}

function Item({ uid, name, navigation }) {
  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('managed-account-details', { uid: uid })}>
      <View style={styles.item}>
        <View style={[styles.icon, { backgroundColor: '#' + calcIconColor(uid) }]}>
          <Text style={styles.iconCapital}>{name?.substring(0, 1).toUpperCase()}</Text>
        </View>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.uid}>{uid}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

function calcIconColor(uid) {
  let iUid = parseInt(uid, 36).toString(16)
  let upper = parseInt(iUid.substring(0, 6), 16)
  let lower = parseInt(iUid.substring(5, 11), 16)
  let c = ((lower ^ upper) + 16000).toString(16).toUpperCase()
  c = '00000'.substring(0, 6 - c.length) + c
  return c
}

export default ManagedAccountsList

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 5,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  name: {
    fontSize: 18,
  },
  uid: {
    fontSize: 14,
    color: '#999999',
  },
  icon: {
    backgroundColor: '#A5C63F',
    borderRadius: 23,
    width: 46,
    height: 46,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCapital: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
  },
})
