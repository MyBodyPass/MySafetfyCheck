import React from 'react'
import { StyleSheet, View } from 'react-native'

const Progressbar = ({ progress }) => {
  return (
    <View style={styles.progressbar}>
      <View style={[styles.progress, { maxWidth: progress + '%' }]} />
    </View>
  )
}

export default Progressbar

const styles = StyleSheet.create({
  progressbar: {
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    minHeight: 10,
  },
  progress: {
    backgroundColor: '#6ca928',
    minHeight: 10,
  },
})
