import AsyncStorageService from './AsyncStorageService'
import RequestQueueItem from '../domain/RequestQueueItem'
import APIService from './api/APIService'
import Utilities from './Utilities'

class RequestBufferService {
  constructor() {
    this.storageKey = 'mbp_upstream_buffer'
  }

  async fetchPendingRequestsFromStorage() {
    return await AsyncStorageService.fetch(this.storageKey)
      .then(response => {
        let json = JSON.parse(response)
        return json
      })
      .catch(error => console.log(error))
  }

  async queueRequest(requestItem: RequestQueueItem) {
    // this.requestBuffer.push(JSON.stringify(requestItem));
    let requestBuffer = this.fetchPendingRequestsFromStorage()

    requestItem.queuedTimestamp = Utilities.getCurrentDateTime()

    // add the request item to the existing queue
    requestBuffer.push(requestItem)

    // store the new list
    await AsyncStorageService.store(this.storageKey, JSON.stringify(requestBuffer))
  }

  async dispatchRequest(requestItem: RequestQueueItem) {
    console.log('dispatching the requestItem', requestItem.getBody())

    requestItem.dispatchedTimestamp = await Utilities.getCurrentDateTime()
    let apiService = new APIService()

    if (requestItem.isValid()) {
      try {
        let response = await apiService.request(
          requestItem.getEndpoint(),
          requestItem.getMethod(),
          requestItem.getHeader(),
          requestItem.getBody(),
          true,
        )

        // then something went wrong.
        if (response.status > 205) {
          // we need to re-queue this request item
        } else {
          // get the response body
          let body = await response.json()
        }
      } catch (error) {
        console.log('[ERROR] : Error dispatching the payload to the endpoint: ', requestItem.getEndpoint())
      }
    }
  }

  async dispatchPendingRequests() {
    // fetch the fresh list of pending requests from storage
    let requestBuffer = await this.fetchPendingRequestsFromStorage()

    let pendingRequests = requestBuffer

    if (requestBuffer != null) {
      for (const i in requestBuffer) {
        let requestItem = requestBuffer[i]

        try {
          Object.setPrototypeOf(requestItem, RequestQueueItem.prototype)

          // only if the object is valid, then dequeue it
          pendingRequests.splice(i, 1)

          await this.dispatchRequest(requestItem)
        } catch (error) {
          console.log(error)
        }
      }
    }

    // override the requests with the pending requests
    if (pendingRequests === null || pendingRequests === undefined) {
      pendingRequests = []
    }

    await AsyncStorageService.store(this.storageKey, JSON.stringify(pendingRequests))
  }
}

export default RequestBufferService
