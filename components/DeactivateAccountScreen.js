import * as React from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import Colors from '../Colors'
import Button from './Button'
import InputField from './InputField'
import { DismissKeyboard } from './Utils'
import UserAPIService from '../src/services/api/UserAPIService'
import Constants from '../src/services/api/Constants'
import { AuthContext } from '../Constants'

export default class DeactivateAccountScreen extends React.Component {
  static contextType = AuthContext

  constructor(props) {
    super(props)

    this.state = {
      password: null,
      isPasswordValid: false,
    }
  }

  validateForm = () => {
    let isValid = false

    let isPasswordValid = false
    if (this.state.password !== null && this.state.password.length > 0) {
      isPasswordValid = true
      isValid = true
    }
    this.setState({ isPasswordValid })

    return isValid
  }

  handlePasswordChange = password => {
    this.setState({ password })
  }

  async submitForm() {
    const { signOut } = this.context

    if (this.validateForm()) {
      let deactivateAccountRequest = await UserAPIService.deactivateAccount(this.state.password)

      let status = await deactivateAccountRequest.status

      if (status === Constants.HTTP_STATUS_ACCEPTED) {
        // 202
        Alert.alert('Account gelöscht', 'Ihr Account wurde erfolgreich gelöscht.')
        signOut()
      } else {
        let err = await deactivateAccountRequest.json()
        Alert.alert('Fehler beim Löschen des Accounts', err.error)
      }
    }
  }

  render() {
    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <View style={styles.form}>
            <InputField
              //style={[styles.input]}
              placeholder="Passwort zur Bestätigung eingeben*"
              //placeholderTextColor="#999"
              value={this.state.password}
              secureTextEntry
              onChange={this.handlePasswordChange}
              //autoCapitalize="none"
              //returnKeyType="next"
            />

            <View style={styles.submitBtn}>
              <Button title="Account unwiderruflich löschen" disabled={true} onPress={() => this.submitForm()} />
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
  form: {
    flexDirection: 'column',
    marginTop: 15,
    paddingHorizontal: 20,
  },
  submitBtn: {
    marginTop: 10,
  },
  invalid: {
    borderColor: Colors.primaryColor,
    backgroundColor: Colors.primaryColor + '20',
  },
  otherContainer: {
    padding: 15,
    marginVertical: 15,
    marginHorizontal: 20,
  },
  otherContainerText: {
    color: Colors.primaryColor,
    textAlign: 'center',
    fontSize: 16,
  },
})
