import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Button from './Button'

export default function SurveyQuestion({ ask, describe, onChange, state }) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{ask}</Text>
      {/*<Text style={styles.description}>{describe}</Text>*/}
      <View style={styles.buttonGroup}>
        <Button
          title="Ja"
          type={state ? 'primary' : 'secondary'}
          style={styles.button}
          onPress={() => onChange(true)}
        />
        <Button
          title="Nein"
          type={state !== null && !state ? 'primary' : 'secondary'}
          style={styles.button}
          onPress={() => onChange(false)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    borderRadius: 5,
    backgroundColor: 'white',
    padding: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    marginLeft: 10,
    paddingHorizontal: 15,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  description: {
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'right',
  },
})
