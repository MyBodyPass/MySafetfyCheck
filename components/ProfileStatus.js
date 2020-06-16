import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Colors from '../Colors'

const statusName = {
  GREY: 'unbekannt',
  GREEN: 'Grün (Alles in Ordnung)',
  GREEN_PERMANENT: 'Grün (dauerhaft)',
  VIOLET: 'Lila (Ungesicherter Kontakt)',
  YELLOW: 'Gelb (Sicherer Kontakt)',
  RED: 'Rot (Bestätigt)',
  RED_SELF: 'Rot (Selbsteinschätzung)',
}

const ProfileStatus = ({ title, status }) => {
  const toCamelCase = str => {
    return str
      .toLowerCase()
      .split(/[_\s\.-]/gi)
      .map(word => word.replace(/^\w/, c => c.toUpperCase()))
      .join('')
  }

  return (
    <View style={styles.category}>
      <Text style={styles.infoCategory}>{title}</Text>
      <View style={[styles.statusIndicator, styles['status' + toCamelCase(status ?? '')]]} />
      <Text style={styles.info}>{statusName[status]}</Text>
    </View>
  )
}

export default ProfileStatus

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
  statusIndicator: {
    backgroundColor: '#efefef',
    borderColor: '#cccccc',
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
  statusGreenPermanent: {
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
  statusRedSelf: {
    backgroundColor: '#e53935',
    borderColor: '#b20612',
    borderWidth: 1,
  },
})
