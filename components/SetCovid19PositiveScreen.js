import * as React from 'react'
import { StyleSheet, View, Alert, Text, Switch, Platform } from 'react-native'
import Colors from '../Colors'
import Button from './Button'
import InputField from './InputField'
import UserAPIService from '../src/services/api/UserAPIService'
import Constants from '../src/services/api/Constants'
import Utilities from '../src/services/Utilities'
import { Picker } from '@react-native-community/picker'
import { DismissKeyboard } from './Utils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'

//TODO: Refactor to function component, add date picker to input fields
export default class SetCovid19PositiveScreen extends React.Component {
  constructor(props) {
    super(props)

    let accountList = []

    this.state = {
      infectedDate: Utilities.getCurrentDateString(),
      firstSymptomDate: Utilities.getCurrentDateString(),

      isInfectedDateValid: true,
      isFirstSymptomDateValid: true,

      password: null,
      isPasswordValid: true,

      acceptTermsAndConditions: false,
      accountList: accountList,
      selectedAccount: null,
      instituteName: null,
      isInstituteNameValid: true,
    }
  }

  async componentDidMount() {
    let accountList = []
    try {
      // get the logged-in user's UID
      let user = await UserAPIService.getProfile()
      accountList.push({ uid: user.uid, username: 'Mich selbst' })
      this.setState({ selectedAccount: user.id })
    } catch (error) {
      Alert.alert('Server Fehler', error)
    }

    this.setState({ accountList: accountList })

    let managedAccountsRequest = await UserAPIService.getManagedAccounts()

    let status = await managedAccountsRequest.status

    this.setState({ accountList: accountList })
    if (status === Constants.HTTP_STATUS_OK) {
      let managedAccounts = await managedAccountsRequest.json()

      let managedAccount = null
      let i = 0
      for (i = 0; i < managedAccounts.length; i++) {
        managedAccount = managedAccounts[i]

        accountList.push({
          username: managedAccount.managedCitizenName,
          uid: managedAccount.managedCitizenUid,
        })
      }
      this.setState({ accountList: accountList })
    }
  }

  handleInfectedDateChange = selectedDate => {
    this.setState({ infectedDate: selectedDate })
  }

  handleFirstSymptomDateChange = selectedDate => {
    this.setState({ firstSymptomDate: selectedDate })
  }

  handleInstituteChange = value => {
    this.setState({ instituteName: value })
  }

  handleAccountChange = value => {
    this.setState({ selectedAccount: value })
  }

  toggleAcceptTermsAndConditions = acceptTermsAndConditions => {
    this.setState({ acceptTermsAndConditions })
  }

  validate() {
    let isValid = false

    if (Utilities.isValidGermanDateFormat(this.state.infectedDate)) {
      isValid = true
      this.setState({ isInfectedDateValid: true })
    } else {
      this.setState({ isInfectedDateValid: false })
    }

    if (!Utilities.isValidGermanDateFormat(this.state.firstSymptomDate)) {
      this.setState({ isFirstSymptomDateValid: false })
      isValid = false
    } else {
      this.setState({ isFirstSymptomDateValid: true })
    }

    if (this.state.instituteName !== null && this.state.instituteName !== '' && this.state.instituteName.length > 0) {
      // valid
      this.setState({ isInstituteNameValid: true })
    } else {
      isValid = false
      this.setState({ isInstituteNameValid: false })
    }

    if (this.state.password !== null && this.state.password !== undefined && this.state.password.length > 0) {
      this.setState({ isPasswordValid: true })
    } else {
      isValid = false
      this.setState({ isPasswordValid: false })
    }

    if (!this.state.acceptTermsAndConditions) {
      isValid = false
      Alert.alert('Unvollständig', 'Bitte aktzeptieren Sie die Nutzungsbedingungen')
    }

    return isValid
  }

  submitForm() {
    if (this.validate()) {
      // if the form fields are valid
      UserAPIService.setCovid19Positive(
        this.state.selectedAccount,
        this.state.password,
        this.state.instituteName,
        Utilities.getTimestampFromDate(this.state.firstSymptomDate),
        Utilities.getTimestampFromDate(this.state.infectedDate),
      )
        .then(result => {
          this.props.navigation.navigate('Home')
          Alert.alert('Status gesetzt', 'Der Status wurde erfolgreich aktualisiert')
        })
        .catch(async err => {
          let error = await err.json()
          console.log(error)
          Alert.alert('Fehler beim Setzen des Status', error.error)
        })
    }
  }

  render() {
    let accountList = this.state.accountList.map((user, index) => {
      return <Picker.Item key={index} value={user.uid} label={user.username} />
    })

    return (
      <DismissKeyboard>
        <KeyboardAwareScrollView style={styles.container}>
          <View style={styles.form}>
            <Text style={[styles.inputLabel]}>Für wen möchten Sie den Status setzen?</Text>
            <Picker
              itemStyle={{ width: '100%' }}
              style={Platform.OS == 'ios' ? styles.iosAccountList : styles.accountList}
              selectedValue={this.state.selectedAccount}
              onValueChange={this.handleAccountChange}>
              {accountList}
            </Picker>
            <InputField
              value={this.state.infectedDate}
              onChange={text => this.handleInfectedDateChange(text)}
              placeholder="Datum des Tests, TT.MM.JJJJ"
              keyboardType="decimal-pad"
              valid={this.state.isInfectedDateValid}
              label="Ich bin positiv getestet worden am:"
            />
            <InputField
              value={this.state.instituteName}
              onChange={this.handleInstituteChange}
              placeholder="Name der Institution"
              valid={this.state.isInstituteNameValid}
              label="Institution, die den Test durchgeführt hat. Zum Beispiel Gesundheitsamt Musterstadt"
              autoCapitalize="words"
            />
            <InputField
              value={this.state.firstSymptomDate}
              onChange={this.handleFirstSymptomDateChange}
              placeholder="Datum der ersten Symptome, TT.MM.JJJJ"
              keyboardType="decimal-pad"
              valid={this.state.isFirstSymptomDateValid}
              label="Datum, an dem ich die ersten Symptome bemerkt habe (Schnupfen, Husten, Fieber, etc.)"
            />
            <InputField
              value={this.state.password}
              onChange={value => this.setState({ password: value })}
              placeholder="Ihr Passwort*"
              valid={this.state.isPasswordValid}
              label="Bitte geben Sie zur Sicherheit Ihr Passwort ein:"
              secureTextEntry
            />

            <View style={styles.termsAndConditionsBlock}>
              <Switch
                onValueChange={this.toggleAcceptTermsAndConditions}
                value={this.state.acceptTermsAndConditions}
                style={styles.termsAndConditionsSwitch}
              />
              <Text style={styles.termsAndConditionsText}>
                Hiermit bestätige ich, dass meine Angaben korrekt sind. Mir ist bewusst, dass falsche Angaben dazu
                führen können, dass ich von der Nutzung der App ausgeschlossen werde.
              </Text>
            </View>

            <View style={styles.submitBtn}>
              <Button title="Status prüfen und setzen" disabled={true} onPress={() => this.submitForm()} />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </DismissKeyboard>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 20,
  },
  form: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  accountList: {
    height: 50,
    flexGrow: 1,
  },
  iosAccountList: {
    height: 200,
    flexGrow: 1,
  },
  inputLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryColor,
  },
  submitBtn: {
    marginTop: 20,
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
  termsAndConditionsBlock: {
    marginBottom: 10,
    flexDirection: 'row',
    marginTop: 20,
  },
  termsAndConditionsSwitch: {},
  termsAndConditionsText: {
    maxWidth: '85%',
  },
})
