import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  Alert,
} from 'react-native'
import Colors from '../Colors'
import Button from './Button'
import TextButton from './TextButton'
import InputField from './InputField'

import { AuthContext, configuration } from '../Constants'
import UserAPIService from '../src/services/api/UserAPIService'
import Utilities from '../src/services/Utilities'
import Constants from '../src/services/api/Constants'
import { DismissKeyboard } from './Utils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'

const RegisterScreen = () => {
  const { setUserToken } = React.useContext(AuthContext)
  const [modalVisible, setModalVisible] = React.useState(false)
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [usernameValid, setUsernameValid] = React.useState(true)
  const [passwordValid, setPasswordValid] = React.useState(true)
  const [passwordRetype, setPasswordRetype] = React.useState('')
  const [emailValid, setEmailValid] = React.useState(true)
  const [acceptTermsAndConditions, setTermsAndConditions] = React.useState(false)

  const toggleAcceptTermsAndConditions = value => {
    setTermsAndConditions(value)
  }

  const validateFormFields = () => {
    let isValid = false

    //Check password and passwordretype are equal
    isValid = password === passwordRetype && passwordValid
    //Check username
    if (username === 'admin' || username === null || username === undefined || username.length <= 0) {
      setUsernameValid(false)
      isValid = false
      Alert.alert('Registration unvollständig', 'Dieser Benutzername ist ungültig')
      return false
    } else {
      if (isValid === true) {
        isValid = true
      }
      setUsernameValid(true)
    }

    if (email.length > 0) {
      if (Utilities.isValidEmail(email)) {
        if (isValid === true) {
          isValid = true
        }
        setEmailValid(true)
      } else {
        isValid = false
        setEmailValid(false)
        Alert.alert('Registration unvollständig', 'Sie haben keine korrekte E-Mail Adresse eingegeben.')
        return false
      }
    }

    if (!acceptTermsAndConditions) {
      isValid = false
      Alert.alert('Registration unvollständig', 'Bitte aktzeptieren Sie die Nutzungsbedingungen')
      return false
    }

    return isValid
  }

  const signUpProcedure = async () => {
    //Create useraccount in webservice
    if (validateFormFields()) {
      setModalVisible(true)
      setTimeout(async () => {
        try {
          let userRegisterRequest = await UserAPIService.register(username, email, password)

          if (userRegisterRequest.status === Constants.HTTP_STATUS_CREATED) {
            // the user has been created

            // now log in the user
            // must be a valid payload with UID and JWT Token
            let userData = await userRegisterRequest.json()

            let userToken = userData.token
            let uid = userData.uid

            // this signifies that the registration was successfull
            if (uid !== null && uid !== undefined && (userToken !== null && userToken !== undefined)) {
              // to check if this is non-anonymous registration
              if (Utilities.isValidEmail(email)) {
                Alert.alert(
                  'Registration erfolgreich',
                  'Sie erhalten in Kürze eine E-Mail von noreply@mybodypass.de um Ihre E-Mail Adresse zu bestätigen. Prüfen Sie auch den Spamordner.',
                )
              } else {
                Alert.alert('Erfolg')
              }
              await setUserToken(userToken)
            }
          } else {
            var errorMessage

            try {
              let errorInfo = await userRegisterRequest.json()
              errorMessage = errorInfo.error
            } catch (error) {
              errorMessage = 'Fehler beim Registrieren. Bitte versuchen Sie erneut.'
            } finally {
              Alert.alert('Unbekannter Fehler', errorMessage)
            }
          }
        } catch (err) {
          throw err
        } finally {
          setModalVisible(false)
        }
      })
    }
    //Save Token to secured storage
  }

  return (
    <DismissKeyboard>
      <KeyboardAwareScrollView style={styles.container}>
        {modalVisible ? (
          <>
            <ActivityIndicator size="large" color={Colors.primaryColor} />
            <Text style={styles.status}>Ihr Account wird jetzt erstellt...</Text>
          </>
        ) : (
          <View style={styles.loginForm}>
            <View style={styles.logoContainer}>
              <Image source={require('../assets/images/mybodypass.jpg')} style={styles.logo} />
            </View>
            <Text style={styles.loginText}>
              Bitte registrieren Sie sich mit einem frei wählbaren Namen. Die E-Mail-Adresse müssen Sie nur angeben, um
              Ihr Passwort in Zukunft zurücksetzen zu können. Um anonym zu bleiben, können Sie dieses Feld aber auch
              einfach leer lassen und sich das Passwort sicher notieren.
            </Text>
            <InputField
              placeholder="Benutzername/Pseudonym*"
              value={username}
              onChange={setUsername}
              valid={usernameValid}
            />
            <InputField
              placeholder="E-Mail (optional)"
              keyboardType="email-address"
              value={email}
              onChange={setEmail}
              onValidation={setEmailValid}
              validation={/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/}
              validationHint="Bitte geben Sie eine korrekte E-Mail Adresse ein"
            />
            <InputField
              placeholder="Passwort*"
              value={password}
              onChange={setPassword}
              secureTextEntry
              onValidation={setPasswordValid}
              validation={/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.-;:_\+\?])(?=.{10,})/}
              validationHint="Passwortstärke reicht nicht aus. Verwenden Sie mindestens 10 Zeichen, Groß- und Kleinbuchstaben, Zahlen sowie Sonderzeichen für den optimalen Schutz Ihrer Daten."
            />
            <InputField
              placeholder="Passwortbestätigung*"
              value={passwordRetype}
              onChange={setPasswordRetype}
              secureTextEntry
              validation={text => {
                return text === password
              }}
              validationHint="Die Passwörter stimmen nicht überein"
            />

            <View style={styles.termsAndConditionsBlock}>
              <View>
                <Switch
                  onValueChange={toggleAcceptTermsAndConditions}
                  value={acceptTermsAndConditions}
                  style={styles.termsAndConditionsSwitch}
                />
              </View>
              <View>
                <Text style={{ maxWidth: '85%' }}>Mit der Registrierung akzeptiere ich die</Text>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(configuration.gdprUrl)
                  }}>
                  <Text style={styles.termsAndConditionsLink}>Datenschutzbestimmungen</Text>
                </TouchableOpacity>
                <Text style={{ maxWidth: '85%' }}> von MyBodyPass</Text>
              </View>
            </View>

            <View style={styles.loginBtn}>
              <Button title="Benutzerkonto anlegen" onPress={() => signUpProcedure()} />
            </View>
            <View style={styles.loginBtn}>
              <TextButton
                title="Mit MyBodyPass registrieren"
                type="secondary"
                onPress={() => Linking.openURL(configuration.activationLink)}
              />
            </View>
          </View>
        )}
        <View style={styles.gdprContainer}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(configuration.gdprUrl)
            }}>
            <Text style={styles.gdprLink}>Datenschutzerklärung</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </DismissKeyboard>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    height: 100,
    maxWidth: '80%',
    resizeMode: 'contain',
  },
  loginForm: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  loginText: {
    textAlign: 'justify',
    marginBottom: 20,
  },
  loginBtn: {
    marginBottom: 20,
  },
  regBtn: {
    padding: 15,
    marginVertical: 30,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 20,
  },
  regText: {
    fontSize: 16,
    color: Colors.primaryColor,
    textAlign: 'center',
  },
  gdprLink: {
    color: '#808080',
    textAlign: 'center',
    marginBottom: 20,
  },
  termsAndConditionsLink: {
    color: '#D24B54',
  },
  gdprContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  disabled: {
    backgroundColor: '#eff0f1',
  },
  invalid: {
    borderColor: Colors.primaryColor,
    backgroundColor: Colors.primaryColor + '20',
  },
  status: {
    textAlign: 'center',
    marginVertical: 10,
  },
  termsAndConditionsBlock: {
    marginBottom: 10,
    flexDirection: 'row',
    marginTop: 20,
  },
  termsAndConditionsSwitch: {
    alignContent: 'flex-end',
    marginTop: 7,
    marginBottom: 10,
    marginLeft: 22,
    marginRight: 0,
  },
})
