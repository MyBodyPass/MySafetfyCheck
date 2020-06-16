import React from 'react'
import { StyleSheet, View, Image, Alert } from 'react-native'
import Colors from '../Colors'
import Button from './Button'
import InputField from './InputField'
import Utilities from '../src/services/Utilities'
import AuthAPIService from '../src/services/api/AuthAPIService'

export default class ResendConfirmationEmail extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: null,
      isValidEmail: true,
    }
  }

  handleEmailChange = email => {
    this.setState({ email })
  }

  async submitForm() {
    let isValidEmail = false

    // check if the email is valid
    if (!Utilities.isValidEmail(this.state.email)) {
      this.setState({ isValidEmail })
      return false
    } else {
      isValidEmail = true
      this.setState({ isValidEmail })
    }

    try {
      let resendEmailRequest = await AuthAPIService.resendConfirmationEmail(this.state.email)

      if (resendEmailRequest === true) {
        Alert.alert(
          'Bestätigungs Mail erneut gesendet',
          'Eine Bestätigungsmail wurde erneut an Ihre E-Mail-Adresse versandt. Bitte prüfen Sie Ihren Posteingang.',
        )
        this.props.navigation.navigate('SignIn')
      }
    } catch (error) {
      Alert.alert(error)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/images/mybodypass.jpg')} style={styles.logo} />
        </View>
        <View style={styles.form}>
          <InputField
            //style={[styles.input, this.state.isValidEmail ? '' : styles.invalid]}
            valid={this.state.isValidEmail}
            placeholder="E-Mail Adresse*"
            //placeholderTextColor="#999"
            value={this.state.email}
            //autoCapitalize="none"
            keyboardType="email-address"
            onChange={this.handleEmailChange}
          />
          <View style={styles.submitBtn}>
            <Button title="Bestätigungsmail erneut senden" onPress={() => this.submitForm()} />
          </View>
        </View>
      </View>
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
