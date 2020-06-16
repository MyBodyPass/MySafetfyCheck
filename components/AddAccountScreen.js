import React from 'react'
import { StyleSheet, Text, View, Switch, Alert } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Colors from '../Colors'
import Button from './Button'
import InputField from './InputField'
import { DismissKeyboard } from './Utils'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ScanService from '../src/services/ScanService'
import UserAPIService from '../src/services/api/UserAPIService'
import Constants from '../src/services/api/Constants'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'

const AddAccountScreen = ({ navigation }) => {
  const [uid, setUid] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [validated, setValidated] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [name, setName] = React.useState('')
  const [type, setType] = React.useState(false)

  const validate = () => {
    let validation = uid.match(/[0-9A-Z]{8}/) && password.length > 0 && name.length > 0
    setValidated(validation)
    return validation
  }

  const sendRequest = async () => {
    setLoading(true)
    let request = await UserAPIService.addManagedAccount({ uid, password, type: type ? 'DIRECT' : 'INDIRECT', name })

    let status = await request.status

    try {
      // if account was created
      if (status === Constants.HTTP_STATUS_CREATED) {
        Alert.alert('MyBodyPass hinzufügt', 'Der MyBodyPass wurde erfolgreich hinzugefügt')
        navigation.navigate('managed-accounts')
      } else {
        let err = await request.json()
        throw err.error
      }
    } catch (error) {
      console.log(error)
      Alert.alert(
        'Fehler beim Hinzufügen',
        'Der Account wird eventuell schon von einer anderen Person verwaltet oder das Passwort ist falsch.',
      )
    } finally {
      setLoading(false)
    }
  }

  const scanCode = () => {
    ScanService.scanCode(
      navigation,
      'Scannen Sie den QR-Code einer MyBodyPass Card, um sie Ihrem Account hinzuzufügen. Das funktioniert nur, ' +
        'wenn die MyBodyPass Card noch keinem anderen Account zugeordnet ist.',
    ).then(data => {
      setUid(data.uid)
    })
  }

  return (
    <DismissKeyboard>
      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.paragraph}>
            Fügen Sie eine MyBodyPass Card zu Ihrem Account hinzu, um über Statusänderungen dieser Karte informiert zu
            werden. Die Karte kann Ihnen selbst gehören oder bspw. einem Familienmitglied ohne Smartphone. Die
            MyBodyPass ID und den Aktivierungscode finden Sie auf der MyBodyPass Card.
          </Text>
          <Text style={[styles.paragraph, styles.notice]}>
            Bitte beachten Sie: Jede MyBodyPass Card kann nur zu einem Account gehören. Ist eine Karte bereits einem
            anderen Account zugeordnet, können Sie die Karte nicht zu Ihrem Account hinzufügen.
          </Text>
          <Text style={styles.caption}>MyBodyPass ID</Text>
          <View style={styles.inputRow}>
            <InputField
              //style={styles.input}
              value={uid}
              autoCapitalize="characters"
              onChange={value => setUid(value)}
            />
            <TouchableOpacity style={styles.inputButton} onPress={() => scanCode()}>
              <MaterialCommunityIcons name="qrcode-scan" size={26} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.caption}>Name des MyBodyPass Card Inhabers</Text>
          <Text style={styles.helpText}>
            Vergeben Sie im Sinne der Anonymität keine vollen Namen, sondern bspw. nur den Vornamen
          </Text>
          <InputField value={name} onChange={value => setName(value)} placeholder="Name des Inhabers" />
          <View style={styles.inputRow}>
            <Switch
              style={styles.directSwitch}
              trackColor={{ false: '#767577', true: Colors.primaryColor }}
              thumbColor={type === 'DIRECT' ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setType}
              value={type}
            />
            <Text style={styles.caption}>Der Inhaber der MyBodyPass Card wohnt mit mir im selben Haushalt</Text>
          </View>
          <Text style={styles.caption}>MyBodyPass Aktivierungscode</Text>
          <Text style={styles.helpText}>Aktivierungscode auf der MyBodyPass Card</Text>
          <InputField
            value={password}
            secureTextEntry
            placeholder="Aktivierungscode"
            onChange={value => setPassword(value)}
          />
          {!validated ? (
            <Text style={styles.validationError}>
              Die MyBodyPass-ID muss aus 8 Zeichen bestehen und der Name und das Kennwort darf nicht leer sein.
            </Text>
          ) : null}
          <Button
            title="Hinzufügen"
            onPress={() => {
              if (validate()) {
                sendRequest()
              }
            }}
            style={styles.button}
            loading={loading}
          />
        </View>
      </KeyboardAwareScrollView>
    </DismissKeyboard>
  )
}

export default AddAccountScreen

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flexGrow: 1,
    flex: 1,
  },
  form: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  caption: {
    color: Colors.primaryColor,
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 120,
    marginTop: 20,
    maxWidth: '85%',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#999',
    flexGrow: 1,
  },
  directSwitch: {
    marginTop: 20,
    marginRight: 5,
  },
  helpText: {
    marginBottom: 5,
  },
  button: {
    marginVertical: 20,
  },
  validationError: {
    color: Colors.errorBackground,
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputButton: {
    paddingHorizontal: 15,
  },
  paragraph: {
    marginBottom: 5,
  },
  notice: {
    color: Colors.primaryColor,
    fontWeight: 'bold',
  },
})
