import * as React from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import Colors from '../Colors'
import Button from './Button'
import InputField from './InputField'
import { DismissKeyboard } from './Utils'
import Utilities from '../src/services/Utilities'
import UserAPIService from '../src/services/api/UserAPIService'
import Constants from '../src/services/api/Constants'

export default class ChangeUserPasswordScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      oldPassword: null,
      newPassword: null,
      confirmNewPassword: null,
      isOldPasswordValid: true,
      isNewPasswordValid: true,
      isConfirmNewPasswordValid: true,
    }
  }

  validateForm = () => {
    let isOldPasswordValid = false
    if (this.state.oldPassword !== null && this.state.oldPassword.length > 0) {
      isOldPasswordValid = true
    }
    this.setState({ isOldPasswordValid })

    let isNewPasswordValid = false
    if (Utilities.isValidPassword(this.state.newPassword)) {
      isNewPasswordValid = true
    }
    this.setState({ isNewPasswordValid })

    let isConfirmNewPasswordValid = false
    if (
      Utilities.isValidPassword(this.state.confirmNewPassword) &&
      this.state.newPassword === this.state.confirmNewPassword
    ) {
      isConfirmNewPasswordValid = true
    }
    this.setState({ isConfirmNewPasswordValid })

    return isOldPasswordValid && isNewPasswordValid && isConfirmNewPasswordValid
  }

  handleOldPasswordChange = oldPassword => {
    this.setState({ oldPassword })
  }

  handleNewPasswordChange = newPassword => {
    this.setState({ newPassword })
  }

  handleConfirmNewPasswordChange = confirmNewPassword => {
    this.setState({ confirmNewPassword })
  }

  async submitForm() {
    if (this.validateForm()) {
      let updatePasswordRequest = await UserAPIService.updatePassword(this.state.oldPassword, this.state.newPassword)
      let status = await updatePasswordRequest.status

      if (status === Constants.HTTP_STATUS_ACCEPTED) {
        // 202
        Alert.alert('Passwort geändert', 'Ihr Passwort wurde erfolgreich geändert.')
        this.props.navigation.navigate('edit-profile')
      } else {
        Alert.alert(
          'Fehler',
          'Es ist ein Fehler beim Ändern des Passwortes aufgetreten. Bitte versuchen Sie es später noch einmal.',
        )
      }
    }
  }

  render() {
    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <View style={styles.form}>
            <InputField
              valid={this.state.isOldPasswordValid}
              placeholder="Altes Passwort*"
              value={this.state.oldPassword}
              secureTextEntry
              onChange={this.handleOldPasswordChange}
            />

            <InputField
              valid={this.state.isNewPasswordValid}
              placeholder="Neues Passwort*"
              value={this.state.newPassword}
              secureTextEntry
              onChange={this.handleNewPasswordChange}
            />

            <InputField
              valid={this.state.isConfirmNewPasswordValid}
              placeholder="Neues Passwort bestätigen*"
              value={this.state.confirmNewPassword}
              secureTextEntry
              onChange={this.handleConfirmNewPasswordChange}
            />
            <View style={styles.submitBtn}>
              <Button title="Neues Passwort setzen" onPress={() => this.submitForm()} />
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
