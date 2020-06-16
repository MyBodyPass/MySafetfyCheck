import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Colors from '../Colors'

const ProfileInformation = ({ title, value }) => {
  return (
    <View style={styles.category}>
      <Text style={styles.infoCategory}>{title}</Text>
      <Text style={styles.info}>{value}</Text>
    </View>
  )
}

export default ProfileInformation

const styles = StyleSheet.create({
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
  category: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
})
