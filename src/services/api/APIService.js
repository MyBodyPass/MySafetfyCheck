import Constants from './Constants'
import InternetConnectivityService from '../InternetConnectivityService'
import RequestBufferService from '../RequestBufferService'
import RequestQueueItem from '../../domain/RequestQueueItem'

class APIService {
  /**
   *
   * @param {String} apiUrl
   * @param {String} requestMethod, can be either GET|POST|PUT|DELETE
   * @param {Object} headers
   * @param {Object} body
   * @param {Boolean} buffer either true|false. If the request needs to be buffered or not
   */
  async request(apiUrl, requestMethod, headers, body, buffer = false) {
    // if there is no internet connection available
    // then queue the request in the buffer
    if (buffer === true && !InternetConnectivityService.isConnectedToInternet()) {
      let requestBufferService = new RequestBufferService()
      requestBufferService.queueRequest(new RequestQueueItem(apiUrl, requestMethod, headers, body))
      return
    }

    let payload = {
      method: requestMethod,
      headers: headers,
    }

    if (body !== null && body !== undefined) {
      payload.body = JSON.stringify(body)
    }

    try {
      return fetch(apiUrl, payload)
    } catch (err) {
      console.log('[ERROR]: Error calling the endpoint : ' + apiUrl)
      throw err
    }
  }

  async get(apiUrl, headers, buffer = false) {
    return await this.request(apiUrl, Constants.HTTP_METHOD_GET, headers, null, buffer)
  }
}

export default APIService
