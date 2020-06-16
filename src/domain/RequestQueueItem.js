class RequestQueueItem {
  constructor(endpoint, method, header, body, queuedTimestamp, dispatchedTimestamp) {
    this.endpoint = endpoint
    this.payload = body
    this.method = method
    this.header = header
    this.queuedTimestamp = queuedTimestamp
    this.dispatchedTimestamp = dispatchedTimestamp
  }

  getEndpoint() {
    return this.endpoint
  }

  getBody() {
    if (this.body != null) {
      this.body.queuedTimestamp = this.queuedTimestamp
      this.body.dispatchedTimestamp = this.dispatchedTimestamp
    }

    return this.body
  }

  getMethod() {
    return this.method
  }

  getHeader() {
    return this.header
  }

  getQueueTimestamp() {
    return this.queuedTimestamp
  }

  dispatchedTimestamp() {
    return this.dispatchedTimestamp
  }

  isValid() {
    if (this.endpoint == null) {
      return false
    }

    // validate other stuffs here
    return true
  }
}

export default RequestQueueItem
