import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native'
import Colors from '../Colors'
import Button from './Button'
import InputField from './InputField'
import AuthAPIService from '../src/services/api/AuthAPIService'
import { DismissKeyboard } from './Utils'

export default class ForgotPasswordScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      token: null,
      username: null,
      isValidToken: true,
      isValidUsername: true,
    }
  }

  handleTokenChange = token => {
    this.setState({ token })
  }

  handleUsernameChange = username => {
    this.setState({ username })
  }

  validate = () => {
    let isValid = false

    // validate username
    let isValidUsername = false
    if (this.state.username !== null && this.state.username.length > 0) {
      isValidUsername = true
      isValid = true
    }
    this.setState({ isValidUsername })

    // validate token
    let isValidToken = false
    if (this.state.token !== null && this.state.token.length > 0) {
      isValidToken = true

      isValid = isValid
    }
    this.setState({ isValidToken })

    return isValid
  }

  async submitForm() {
    // validate the form entries first
    if (this.validate()) {
      // send to the remote service
      try {
        let request = await AuthAPIService.forgotPassword(this.state.username, this.state.token)

        if (request === true) {
          Alert.alert(
            'Überprüfen Sie Ihr Postfach',
            'Sie erhalten per Mail einen Link zum zurücksetzen Ihres Passworts.',
          )
          this.props.navigation.navigate('SignIn')
        }
      } catch (error) {
        Alert.alert('Fehler beim Zurücksetzen des Passworts', error)
      }
    }
  }

  render() {
    const { navigate } = this.props.navigation

    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/images/mybodypass.jpg')} style={styles.logo} />
          </View>
          <View style={styles.forgotPasswordForm}>
            <InputField
              placeholder="Benutzername*"
              value={this.state.username}
              onChangeText={this.handleUsernameChange}
              valid={this.state.isValidUsername}
            />

            <InputField
              placeholder="E-Mail Adresse oder Resettoken*"
              value={this.state.token}
              onChangeText={this.handleTokenChange}
              valid={this.state.isValidToken}
            />
            <View style={styles.submitBtn}>
              <Button title="Passwort zurücksetzen" onPress={() => this.submitForm()} />
            </View>
            <View style={styles.otherContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigate('SignIn')
                }}>
                <Text style={styles.otherContainerText}>Passwort doch nicht vergessen? Jetzt einloggen.</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </DismissKeyboard>
    )
  }
}

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
  forgotPasswordForm: {
    flexDirection: 'column',
    paddingHorizontal: 20,
  },
  submitBtn: {
    marginTop: 20,
  },
  otherContainer: {
    padding: 15,
    marginVertical: 15,
  },
  otherContainerText: {
    color: Colors.primaryColor,
    textAlign: 'center',
    fontSize: 16,
  },
})
