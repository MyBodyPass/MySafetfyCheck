import Configuration from './Configuration.js'
import APIService from './APIService.js'
import Constants from './Constants.js'
import Utilities from '../Utilities.js'
import AppUser from '../../domain/AppUser.js'

class UserAPIService {
  static async getProfile() {
    try {
      let apiService = new APIService()
      let headers = await Utilities.prepareHeaders(true, 'json')

      let userData = await apiService.get(Configuration.API_USER_PROFILE_URL, headers)

      let appUser = await userData.json()

      Object.setPrototypeOf(appUser, AppUser.prototype)

      return appUser
    } catch (error) {
      throw error
    }
  }

  static async register(username, email, password) {
    // if the user does not provide an email, then the registration
    // type is anonymous
    if (email === null || email === undefined || email.length <= 0) {
      return await UserAPIService.registerAnonymously(username, password)
    }

    let apiService = new APIService()

    let headers = await Utilities.prepareHeaders(false, 'json')

    let user = {
      username: username,
      email: email,
      password: password,
    }

    let userData = await apiService.request(
      Configuration.API_REGISTER_URL,
      Constants.HTTP_METHOD_POST,
      headers,
      user,
      false,
    )

    return userData
  }

  static async registerAnonymously(username, password) {
    let apiService = new APIService()

    let headers = await Utilities.prepareHeaders(false, 'json')

    let user = {
      username: username,
      password: password,
    }

    let userData = await apiService.request(
      Configuration.API_REGISTER_ANO_URL,
      Constants.HTTP_METHOD_POST,
      headers,
      user,
      false,
    )

    return userData
  }

  static async update(appUser: AppUser) {
    let apiService = new APIService()

    let headers = await Utilities.prepareHeaders(true, 'json')

    delete appUser.password
    delete appUser.username

    appUser.queuedTimestamp = await Utilities.getCurrentDateTime()
    appUser.dispatchedTimestamp = await Utilities.getCurrentDateTime()

    return await apiService.request(
      Configuration.API_UPDATE_USER_PROFILE,
      Constants.HTTP_METHOD_PUT,
      headers,
      appUser,
      true,
    )
  }

  static async updatePassword(oldPassword, newPassword) {
    let apiService = new APIService()

    let headers = await Utilities.prepareHeaders(true, 'json')

    let body = {
      password: newPassword,
      oldPassword: oldPassword,
    }

    return await apiService.request(
      Configuration.API_UPDATE_USER_UPDATE_PASSWORD,
      Constants.HTTP_METHOD_PATCH,
      headers,
      body,
      false,
    )
  }

  static async getManagedAccounts() {
    let apiService = new APIService()

    let headers = await Utilities.prepareHeaders(true, 'json')

    return await apiService.request(
      Configuration.API_GET_MANAGED_ACCOUNTS,
      Constants.HTTP_METHOD_GET,
      headers,
      null,
      false,
    )
  }

  static async addManagedAccount({ uid, password, type, name }) {
    let apiService = new APIService()

    let headers = await Utilities.prepareHeaders(true, 'json')

    return await apiService.request(
      Configuration.API_ADD_MANAGED_ACCOUNT,
      Constants.HTTP_METHOD_POST,
      headers,
      {
        citizenUid: uid,
        citizenInitialPassword: password,
        connectionType: type,
        name: name,
      },
      false,
    )
  }

  static async deactivateAccount(password) {
    let apiService = new APIService()

    let headers = await Utilities.prepareHeaders(true, 'json')

    let body = {
      password: password,
    }

    return await apiService.request(
      Configuration.API_DEACTIVATE_ACCOUNT,
      Constants.HTTP_METHOD_DELETE,
      headers,
      body,
      false,
    )
  }

  static async setCovid19Positive(uid, password, testPerformedBy, firstSymptomsOn, testPerformedOn) {
    let apiService = new APIService()

    let headers = await Utilities.prepareHeaders(true, 'json')
    let body = {
      uid: uid,
      password: password,
      testPerformedBy: testPerformedBy,
      firstSymptomsOn: firstSymptomsOn,
      testPerformedOn: testPerformedOn,
    }

    return await apiService.request(
      Configuration.API_USER_SET_COVID_POSITIVE,
      Constants.HTTP_METHOD_POST,
      headers,
      body,
      false,
    )
  }

  static async getManagedUserProfile(managedAccountUid) {
    try {
      let apiService = new APIService()
      let headers = await Utilities.prepareHeaders(true, 'json')

      let userData = await apiService.get(Configuration.getManagedAccountProfileUrl(managedAccountUid), headers)

      let managedUser = await userData.json()

      return managedUser
    } catch (error) {
      throw error
    }
  }
}

export default UserAPIService
