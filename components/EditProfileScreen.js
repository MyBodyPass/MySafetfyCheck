import React from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import Colors from '../Colors'
import Button from './Button'
import InputField from './InputField'
import AppUser from '../src/domain/AppUser'
import { DismissKeyboard } from './Utils'
import UserAPIService from '../src/services/api/UserAPIService'
import Constants from '../src/services/api/Constants'
import Utilities from '../src/services/Utilities'

class EditProfileScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      user: new AppUser(),
      password: null,
      repeatPassword: null,
    }
  }

  async componentDidMount() {
    try {
      const userData = await UserAPIService.getProfile()
      if (userData !== null) {
        this.setState({ user: userData })
      }
    } catch (error) {
      throw error
    }
  }

  handleRealNameChange = realName => {
    let user = this.state.user
    user.name = realName
    this.setState({ user })
  }

  handleEmailChange = email => {
    let user = this.state.user
    user.email = email
    this.setState({ user })
  }

  toggleHasChronicDiseases = value => {
    let user = this.state.user
    user.hasChronicDiseases = value
    this.setState({ user })
  }

  toggleWorkingInMedicine = value => {
    let user = this.state.user
    user.worksInMedicine = value
    this.setState({ user })
  }

  async deactivateAccount() {
    Alert.alert(
      'Account wirklich löschen?',
      'Alle Daten werden entfernt und auch die Ihnen zugeordneten Accounts werden unwiderruflich gelöscht!',
      [
        {
          text: 'Abbrechen',
          onPress: () => {},
          style: 'Cancel',
        },
        { text: 'Ja', onPress: () => this.props.navigation.navigate('deactivate-account') },
      ],
      { cancelable: false },
    )
  }

  async updateProfile() {
    let isValid = true
    if (this.state.user.email !== null) {
      // verify if it is a valid email
      isValid = Utilities.isValidEmail(this.state.user.email)

      if (!isValid) {
        Alert.alert('Profil nicht geändert', 'Bitte geben Sie eine korrekte E-Mail Adresse an.')
      }
    }

    if (isValid === true) {
      let request = await UserAPIService.update(this.state.user)

      let status = await request.status
      if (status === Constants.HTTP_STATUS_ACCEPTED) {
        Alert.alert('Profil geändert', 'Ihr Profil wurde erfolgreich gespeichert.')
        this.props.navigation.navigate('profile')
      } else {
        let err = await request.json()
        console.log(err.error)
        Alert.alert('Profil nicht geändert', err.error)
      }
    }
  }

  render() {
    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <View style={styles.profileForm}>
            <View style={styles.profileInfo}>
              <Text style={styles.infoCategory}>Benutzername</Text>
              <Text style={styles.info}>{this.state.user.username}</Text>
              <InputField
                placeholder="E-Mail Adresse"
                label="E-Mail Adresse"
                onChange={this.handleEmailChange}
                value={this.state.user.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <InputField
                placeholder="Realer Name"
                onChange={this.handleRealNameChange}
                value={this.state.user.name}
                label="Realer Name"
              />
            </View>
            {/*<View style={styles.extraFieldsBlock}>
              <View style={{ flex: 1 }}>
                <Switch
                  onValueChange={this.toggleHasChronicDiseases}
                  value={this.state.user.hasChronicDiseases}
                  style={styles.userProfileSwitch}
                />
              </View>
              <View style={{ flex: 3 }}>
                <Text style={styles.userProfileSwitchText}>Haben Sie chronische Krankheiten?</Text>
              </View>
            </View>

            <View style={styles.extraFieldsBlock}>
              <View style={{ flex: 1 }}>
                <Switch
                  onValueChange={this.toggleWorkingInMedicine}
                  value={this.state.user.worksInMedicine}
                  style={styles.userProfileSwitch}
                />
              </View>
              <View style={{ flex: 3 }}>
                <Text style={styles.userProfileSwitchText}>Arbeiten Sie aktuell in einem medizinischen Beruf?</Text>
              </View>
    </View>*/}
            <View style={styles.submitButton}>
              <Button title="Einstellungen speichern" onPress={() => this.updateProfile()} />
            </View>
          </View>
          <View style={styles.submitButton}>
            <Button title="Passwort ändern" onPress={() => this.props.navigation.navigate('update-password')} />
          </View>

          <View style={styles.submitButton}>
            <Button
              title="Eigenen Status setzen"
              onPress={() => this.props.navigation.navigate('update-account-status')}
            />
          </View>

          <View style={styles.submitButton}>
            <Button title="Account löschen" onPress={() => this.deactivateAccount()} />
          </View>
        </View>
      </DismissKeyboard>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  infoCategory: {
    color: Colors.primaryColor,
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
  profileForm: {
    flexDirection: 'column',
    marginTop: 10,
  },
  profileInfo: {
    marginHorizontal: 20,
  },
  submitButton: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  extraFieldsBlock: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  userProfileSwitchText: {
    marginTop: 7,
    alignContent: 'flex-start',
  },
  userProfileSwitch: {
    alignContent: 'flex-end',
    marginTop: 0,
    marginBottom: 5,
    marginLeft: 22,
    marginRight: 0,
  },
})

export default EditProfileScreen
