/**
 * Component for all textual input fields.
 *
 * Required properties: value, onChange (function), placeholder
 *
 * Also solves input value cropped off if using the bigger font on android.
 * @author f.schleich@r-ie.de
 * @since 2020-05-06
 */

import React from 'react'
import { StyleSheet, TextInput, Text, View } from 'react-native'
import Colors from '../Colors'

const InputField = ({
  value,
  onChange = () => {},
  onValidation = () => {},
  placeholder,
  keyboardType = 'default',
  valid = true,
  label = '',
  validation = () => true,
  validationHint = '',
  ...props
}) => {
  const [hovered, setHovered] = React.useState(false)
  const [internalValid, setInternalValid] = React.useState(valid)

  const labelComponent =
    label !== '' ? (
      <Text testID="label" style={[styles.inputLabel]}>
        {label}
      </Text>
    ) : null

  const handleChange = text => {
    let v = true
    if (validation instanceof Function) {
      v = validation(text)
    }
    if (validation instanceof RegExp) {
      v = text.match(validation)
    }

    setInternalValid(v)
    onChange(text)
    onValidation(v)
  }

  return (
    <View style={styles.container}>
      {labelComponent}
      <TextInput
        testID="input"
        style={[styles.input, hovered ? styles.hovered : null, internalValid ? styles.valid : styles.invalid]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={handleChange}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        keyboardType={keyboardType}
        allowFontScaling={true}
        {...props}
      />
      {!internalValid ? <Text style={styles.hint}>{validationHint}</Text> : null}
    </View>
  )
}

export default InputField

const styles = StyleSheet.create({
  input: {
    borderColor: '#aaa',
    borderBottomWidth: 2,
    color: 'black',
    minHeight: 42,
  },
  hovered: {
    borderColor: Colors.primaryColor,
  },
  valid: {},
  invalid: {
    borderColor: Colors.primaryColor,
    backgroundColor: Colors.primaryColor + '20',
  },
  container: {
    marginBottom: 5,
    flexGrow: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryColor,
  },
  hint: {
    color: Colors.primaryColor,
  },
})
