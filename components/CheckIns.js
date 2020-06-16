import React from 'react'
import { SafeAreaView, View, FlatList, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native'
import moment from 'moment'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import Colors from '../Colors'
import { CheckInContext } from '../Constants'

function Item({ id, title, type, checkIn, checkOut, onCheckOut, checkoutEnabled }) {
  return (
    <View style={[styles.item]}>
      <Text style={styles.title}>{type === 'CITIZEN' ? 'Andere Person' : title}</Text>
      <View style={styles.contentBlock}>
        <View>
          <Text style={styles.checkInTime}>
            <MaterialCommunityIcons name="arrow-right" style={styles.checkinIcon} size={16} />{' '}
            {moment(checkIn * 1000).format('DD.MM.YYYY HH:mm:ss')}
          </Text>
          <Text style={styles.checkOutTime}>
            <MaterialCommunityIcons name="arrow-left" style={styles.checkoutIcon} size={16} />{' '}
            {checkOut !== null ? moment(checkOut * 1000).format('DD.MM.YYYY HH:mm:ss') : 'noch anwesend'}
          </Text>
        </View>
        {checkOut === null && checkoutEnabled ? (
          <View style={styles.checkoutBtnContainer}>
            <TouchableOpacity style={styles.checkoutButton} onPress={() => onCheckOut(id)}>
              <Text style={styles.checkOutButtonText}>Jetzt auschecken</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  )
}

export default function CheckIns({ navigation, list, handleCheckOut, checkoutEnabled = true }) {
  let { setCheckIn } = React.useContext(CheckInContext)

  return (
    <SafeAreaView style={styles.container}>
      {list === null || list.length === 0 ? (
        <Text style={styles.noEntryText}>Sie haben sich bisher noch in keinen Standort eingecheckt.</Text>
      ) : (
        <FlatList
          data={list}
          renderItem={({ item }) => (
            <Item
              id={item.uid}
              title={item.name ?? item.uid}
              type={item.type}
              checkIn={item.checkedIn}
              checkOut={item.checkedOut}
              onCheckOut={uid => handleCheckOut(item)}
              checkoutEnabled={checkoutEnabled}
            />
          )}
          keyExtractor={item => '' + item.checkedIn}
          style={styles.list}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  item: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    padding: 5,
    paddingHorizontal: 10,
  },
  contentBlock: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    flexGrow: 1,
  },
  checkinIcon: {
    color: '#57b460',
  },
  checkoutIcon: {
    color: '#dc2b4d',
  },
  noEntryText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  checkoutButton: {
    backgroundColor: Colors.primaryColor,
    color: '#fff',
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  checkOutButtonText: {
    color: '#fff',
  },
  checkoutBtnContainer: {
    alignItems: 'flex-end',
    flexGrow: 1,
  },
})
