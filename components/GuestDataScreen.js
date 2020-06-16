import React from 'react'
import { StyleSheet, Text, View, NativeModules, Alert, Dimensions } from 'react-native'
import InputField from './InputField'
import ProfileInformation from './ProfileInformation'
import Button from './Button'
var Aes = NativeModules.Aes
import AsyncStorage from '@react-native-community/async-storage'
import { DismissKeyboard } from './Utils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import QRCode from 'react-native-qrcode-svg'

const generateKey = (password, salt, cost, length) => Aes.pbkdf2(password, salt, cost, length)

const encryptData = (text, key) => {
  return Aes.randomKey(16).then(iv => {
    return Aes.encrypt(text, key, iv).then(cipher => ({
      cipher,
      iv,
    }))
  })
}

const decryptData = (encryptedData, key) => Aes.decrypt(encryptedData.cipher, key, encryptedData.iv)

const GuestDataScreen = () => {
  const [credentials, setCredentials] = React.useState(null)
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState(null)
  const [passwordValid, setPasswordValid] = React.useState(false)
  const [passwordPlaceholder, setPasswordPlaceholder] = React.useState('')

  const deleteGuestData = () => {
    Alert.alert(
      'Daten unwideruflich löschen',
      'Mit diesem Schritt löschen Sie alle in der App abgelegten Gastdaten unwiderruflich.',
      [
        {
          text: 'Abbrechen',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            AsyncStorage.removeItem('guestData')
            setCredentials(null)
            setPassword('')
            setCode(null)
          },
        },
      ],
      { cancelable: false },
    )
  }

  const saveGuestData = (pass, data) => {
    generateKey(pass, 'salt', 5000, 256).then(key => {
      console.log('Key:', key)
      encryptData(JSON.stringify(data), key).then(({ cipher, iv }) => {
        console.log('Encrypted:', cipher)
        console.log('IV:', iv)
        AsyncStorage.setItem('guestData', JSON.stringify({ cipher, iv }))
        Alert.alert('Daten gespeichert', 'Ihre Daten wurden verschlüsselt auf Ihrem Gerät abgelegt')
      })
    })
  }

  const getGuestData = pass => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('guestData').then(value => {
        if (value === null) {
          resolve({
            guestName: '',
            guestAddress: '',
            guestPhoneNumber: '',
            guestEmail: '',
          })
          return
        }
        generateKey(pass, 'salt', 5000, 256).then(key => {
          decryptData(JSON.parse(value), key)
            .then(text => {
              console.log('Decrypted:', text)
              resolve(JSON.parse(text))
            })
            .catch(error => {
              reject('Bei der Entschlüsselung der Daten ist ein Fehler aufgetreten')
            })
        })
      })
    })
  }

  const getCodeData = pass => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('guestData').then(value => {
        if (value === null) {
          reject('Keine gespeicherten Daten gefunden')
          return
        }
        generateKey(pass, 'salt', 5000, 256).then(key => {
          decryptData(JSON.parse(value), key)
            .then(text => {
              console.log('Decrypted:', text)
              resolve(JSON.parse(text))
            })
            .catch(error => {
              reject('Bei der Entschlüsselung der Daten ist ein Fehler aufgetreten')
            })
        })
      })
    })
  }

  React.useEffect(() => {
    AsyncStorage.getItem('guestData').then(value => {
      if (value === null) {
        setPasswordPlaceholder('Passwort festlegen')
      } else {
        setPasswordPlaceholder('Passwort eingeben')
      }
    })
  })

  const form = (
    <View>
      <View style={styles.row}>
        <Text style={styles.label}>Name:</Text>
        <InputField
          value={credentials?.guestName}
          onChange={value => setCredentials({ ...credentials, guestName: value })}
          placeholder="Ihr Name"
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Adresse:</Text>
        <InputField
          value={credentials?.guestAddress}
          onChange={value => setCredentials({ ...credentials, guestAddress: value })}
          placeholder="Ihre Postadresse"
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Telefonnummer:</Text>
        <InputField
          value={credentials?.guestPhoneNumber}
          onChange={value => setCredentials({ ...credentials, guestPhoneNumber: value })}
          placeholder="Ihre Telefonnummer"
          keyboardType="number-pad"
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>E-Mail Adresse:</Text>
        <InputField
          value={credentials?.guestEmail}
          onChange={value => setCredentials({ ...credentials, guestEmail: value })}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Ihre E-Mail Adresse"
          validation={/^(\S+@\S+\.\S+|.{0})$/i}
          validationHint="Bitte geben Sie eine korrekte E-Mail Adresse ein"
        />
      </View>
      <View style={styles.row}>
        <Button title="Daten speichern" onPress={() => saveGuestData(password, credentials)} />
        <Button title="Daten löschen" type="secondary" onPress={() => deleteGuestData()} style={{ marginTop: 10 }} />
      </View>
    </View>
  )

  return (
    <DismissKeyboard>
      <KeyboardAwareScrollView style={styles.container}>
        <ProfileInformation title="Daten zur Erfassung von digitalen Gästelisten" />
        {credentials !== null && code === null ? (
          form
        ) : code !== null ? (
          <>
            <View style={{ marginTop: 10 }} />
            <QRCode value={code} style={styles.qrCode} size={Dimensions.get('window').width - 40} />
            <Text style={styles.codeText}>
              Zeigen Sie diesen Code dem MyBodyPass Terminal um Ihre Daten zu übernehmen.
            </Text>
          </>
        ) : (
          <>
            <InputField
              placeholder={passwordPlaceholder}
              secureTextEntry
              value={password}
              onChange={setPassword}
              onValidation={setPasswordValid}
              validation={text => {
                return text.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.-;:_\+\?])(?=.{10,})/)
              }}
              validationHint="Passwortstärke reicht nicht aus. Verwenden Sie mindestens 10 Zeichen, Groß- und Kleinbuchstaben, Zahlen sowie Sonderzeichen für den optimalen Schutz Ihrer Daten."
            />
            <View style={{ flexDirection: 'row', flexGrow: 1, marginTop: 10, justifyContent: 'space-between' }}>
              <Button
                title="Daten ändern"
                onPress={() => {
                  if (passwordValid) {
                    getGuestData(password)
                      .then(creds => setCredentials(creds))
                      .catch(error => Alert.alert('Fehler', error))
                  }
                }}
                type="secondary"
                enabled={passwordValid}
              />
              <Button
                title="Code anzeigen"
                onPress={() =>
                  getCodeData(password)
                    .then(creds => {
                      setCode(JSON.stringify(creds))
                    })
                    .catch(error => Alert.alert('Fehler', error))
                }
                enabled={passwordValid}
              />
            </View>
          </>
        )}
      </KeyboardAwareScrollView>
    </DismissKeyboard>
  )
}

export default GuestDataScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexGrow: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  qrCode: {
    paddingTop: 20,
  },
  codeText: {
    textAlign: 'center',
    paddingTop: 10,
  },
})
