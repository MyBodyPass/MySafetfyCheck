class Configuration {
  static API_BASE_URL = __DEV__ ? 'https://api-test.mybodypass.de' : 'https://api.mybodypass.de'

  // user profile API URL
  static API_USER_PROFILE_URL = Configuration.API_BASE_URL + '/profile'

  // authentication, authorization and registration
  static API_LOGIN_URL = Configuration.API_BASE_URL + '/login'
  static API_REGISTER_URL = Configuration.API_BASE_URL + '/register'
  static API_REGISTER_ANO_URL = Configuration.API_BASE_URL + '/register-anonymously'
  static API_FORGOT_PASSWORD_URL = Configuration.API_BASE_URL + '/password/forgot'
  static API_UPDATE_USER_PROFILE = Configuration.API_BASE_URL + '/profile'
  static API_UPDATE_USER_UPDATE_PASSWORD = Configuration.API_BASE_URL + '/profile/password'
  static API_RESEND_CONFIRMATION_EMAIL = Configuration.API_BASE_URL + '/register/resend-email'
  static API_GET_MANAGED_ACCOUNTS = Configuration.API_BASE_URL + '/connections/managing'
  static API_ADD_MANAGED_ACCOUNT = Configuration.API_BASE_URL + '/connections'
  static API_DEACTIVATE_ACCOUNT = Configuration.API_BASE_URL + '/deactivate'
  static API_USER_SET_COVID_POSITIVE = Configuration.API_BASE_URL + '/profile/red-self-medical-status'

  static API_USER_MANAGED_ACCOUNT_ROOT = Configuration.API_BASE_URL + '/connections/managing'

  //static API_LOCATION_CHECKIN = Configuration.API_BASE_URL + '/checkins/location'
  //static API_CITIZEN_CHECKIN = Configuration.API_BASE_URL + '/checkins/citizen'
  static API_CHECKIN = Configuration.API_BASE_URL + '/checkins'
  static API_LOCATION_CHECKOUT = Configuration.API_BASE_URL + '/location-checkout'
  static API_LIST_CHECKINS = Configuration.API_BASE_URL + '/checkins'

  static API_POST_SURVEY = Configuration.API_BASE_URL + '/surveys'

  static getManagedAccountProfileUrl(uid) {
    return Configuration.API_USER_MANAGED_ACCOUNT_ROOT + '/' + uid + '/profile'
  }

  static getManagedAccountCheckInsUrl(uid) {
    return Configuration.API_USER_MANAGED_ACCOUNT_ROOT + '/' + uid + '/checkins'
  }
}

export default Configuration
