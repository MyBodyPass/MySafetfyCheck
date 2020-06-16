import Configuration from './Configuration'
import APIService from './APIService'
import Utilities from '../Utilities'
import Constants from './Constants'

class AuthAPIService {
  /**
   *
   * @param {string} username
   * @param {string} password
   */
  static async login(username, password) {
    let apiService = new APIService()

    let headers = await Utilities.prepareHeaders(false, 'json')

    let body = {
      username: username,
      password: password,
    }

    let loginRequest = await apiService.request(
      Configuration.API_LOGIN_URL,
      Constants.HTTP_METHOD_POST,
      headers,
      body,
      false,
    )

    if (loginRequest.status === Constants.HTTP_STATUS_OK) {
      let response = await loginRequest.json()

      if (response !== null) {
        return response.token
      }
    }
    let errorMessage = 'Fehler beim Anmelden. Bitte probieren Sie es später noch einmal.'

    if (loginRequest.status === Constants.HTTP_STATUS_UNAUTHORIZED) {
      errorMessage = 'Benutzername oder Passwort falsch. Bitte überprüfen Sie Ihre Zugangsdaten.'
    }

    throw errorMessage
  }

  /**
   * Here token could be either an email address or reset token
   * @param {string} token
   */
  static async forgotPassword(username, token) {
    let apiService = new APIService()

    let headers = await Utilities.prepareHeaders(false, 'json')

    let body = {
      username: username,
      email: token,
    }

    let passwordResetRequest = await apiService.request(
      Configuration.API_FORGOT_PASSWORD_URL,
      Constants.HTTP_METHOD_POST,
      headers,
      body,
      false,
    )

    let status = await passwordResetRequest.status
    var errorMessage

    if (status === Constants.HTTP_STATUS_ACCEPTED) {
      return true
    } else if (status === Constants.HTTP_STATUS_NOT_FOUND) {
      let err = await passwordResetRequest.json()
      errorMessage = err.error
    } else {
      errorMessage = 'Unbekannter Fehler. Bitte versuchen Sie es erneut.'
    }

    throw errorMessage
  }

  static async resendConfirmationEmail(email) {
    let apiService = new APIService()

    let headers = await Utilities.prepareHeaders(false, 'json')

    let body = { email: email }

    let resendConfirmationEmailRequest = await apiService.request(
      Configuration.API_RESEND_CONFIRMATION_EMAIL,
      Constants.HTTP_METHOD_POST,
      headers,
      body,
      false,
    )

    let status = await resendConfirmationEmailRequest.status

    var errorMessage

    if (status === Constants.HTTP_STATUS_ACCEPTED) {
      return true
    } else if (status === Constants.HTTP_STATUS_BAD_REQUEST || status === Constants.HTTP_STATUS_NOT_FOUND) {
      let err = await resendConfirmationEmailRequest.json()
      errorMessage = err.error
    }

    // if the code reaches at this point, then an error
    // must have been encountered
    throw errorMessage
  }
}

export default AuthAPIService
