class AsyncStorageService {
  static buffer = [
    {
      endpoint: 'http://192.168.0.164:8080/api/v1.0',
      method: 'POST',
      header: {},
      body: {},
      dispatchedTimestamp: null,
      queuedTimestamp: null,
    },
    {
      endpoint: 'http://192.168.0.164:8080/api/v1.0',
      method: 'POST',
      header: { Authorization: 'x0235325453' },
      body: { location: '12' },
      dispatchedTimestamp: null,
      queuedTimestamp: null,
    },
  ]

  static async fetch(key) {
    return JSON.stringify(AsyncStorageService.buffer)
  }

  static async store(key, value) {
    this.buffer.push(value)
  }
}

export default AsyncStorageService
