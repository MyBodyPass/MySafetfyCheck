import Utilities from '../Utilities'
import Configuration from '../api/Configuration'
import APIService from './APIService'
import Constants from './Constants'

export default class CheckInService {
  static async checkIn(locationId) {
    let apiService = new APIService()

    let headers = await Utilities.prepareHeaders(true, 'json')

    let payload = {
      uid: locationId,
      queuedTimestamp: await Utilities.getCurrentDateTime(),
      dispatchedTimestamp: await Utilities.getCurrentDateTime(),
    }

    let checkInRequest = await apiService.request(
      Configuration.API_CHECKIN,
      Constants.HTTP_METHOD_POST,
      headers,
      payload,
      true,
    )

    let status = await checkInRequest.status

    if (status === Constants.HTTP_STATUS_CREATED) {
      // 201
      return true
    }

    // if the flow reaches to this point,
    // then an error has been encountered at the server
    // while processing the request
    let err = await checkInRequest.json()

    throw err.error
    // throw 'Error checking out location ' + locationId
  }

  static async listCheckIns() {
    let apiService = new APIService()

    let headers = await Utilities.prepareHeaders(true, 'json')

    let checkinsRequest = await apiService.get(Configuration.API_LIST_CHECKINS, headers, false)

    let status = await checkinsRequest.status

    if (status === Constants.HTTP_STATUS_OK) {
      return await checkinsRequest.json()
    }

    // if the flow reaches to this point,
    // then an error has been encountered at the server
    // while processing the request
    let err = await checkinsRequest.json()

    throw err.error
  }

  static async listManagedAccountCheckIns(managedAccountUid) {
    let apiService = new APIService()

    let headers = await Utilities.prepareHeaders(true, 'json')

    let checkinsRequest = await apiService.get(
      Configuration.getManagedAccountCheckInsUrl(managedAccountUid),
      headers,
      false,
    )

    let status = await checkinsRequest.status

    if (status === Constants.HTTP_STATUS_OK) {
      return await checkinsRequest.json()
    }

    // if the flow reaches to this point,
    // then an error has been encountered at the server
    // while processing the request
    let err = await checkinsRequest.json()

    throw err.error
  }
}
