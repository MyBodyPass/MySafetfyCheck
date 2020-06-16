import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Colors from '../Colors'

const TextButton = ({ title, onPress, type, style = {} }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[style, styles.button]}>
        <Text style={[styles.text, type === 'secondary' ? styles.secondary : styles.primary]}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default TextButton

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 5,
    borderColor: Colors.borderColor,
    backgroundColor: 'transparent',
  },
  secondary: {
    color: '#888',
  },
  primary: {
    color: Colors.primaryColor,
  },
  text: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
})
