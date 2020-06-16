import AsyncStorage from '@react-native-community/async-storage'

class AsyncStorageService {
  static async fetch(key) {
    return await AsyncStorage.getItem(key)
  }

  static async store(key, value) {
    return await AsyncStorage.setItem(key, value)
  }
}

export default AsyncStorageService
