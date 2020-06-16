import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import Colors from '../Colors'

const Button = ({ title, onPress = () => {}, type = 'primary', style = {}, loading = false, enabled = true }) => {
  let button = (
    <View
      style={[
        style,
        styles.button,
        enabled ? styles.enabled : styles.disabled,
        type === 'secondary' ? styles.secondary : styles.primary,
      ]}>
      <Text
        style={[
          styles.text,
          type === 'secondary' ? styles.secondaryText : styles.primaryText,
          { fontSize: style.fontSize },
        ]}>
        {title}
      </Text>
    </View>
  )

  let buttonWrapper = enabled ? (
    <TouchableOpacity
      onPress={() => {
        if (enabled) {
          onPress()
        }
      }}>
      {button}
    </TouchableOpacity>
  ) : (
    <>{button}</>
  )

  return (
    <>
      {loading ? (
        <View style={[style, styles.button, type === 'secondary' ? styles.secondary : styles.primary]}>
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      ) : (
        buttonWrapper
      )}
    </>
  )
}

export default Button

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 5,
    borderColor: Colors.borderColor,
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: '#dddddd',
  },
  secondaryText: {
    color: '#333333',
  },
  primary: {
    backgroundColor: Colors.primaryColor,
  },
  text: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
})
