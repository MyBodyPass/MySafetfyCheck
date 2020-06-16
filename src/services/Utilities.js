import AsyncStorageService from './AsyncStorageService'
import Constants from './api/Constants'
import moment from 'moment'

const Utilities = {
  /**
   * Get the current date and time
   */
  getCurrentDateTime: () => {
    let currentDate = new Date().getTime() / 1000
    return currentDate
  },

  getCurrentDateString: () => {
    return moment().format('DD.MM.YYYY')
  },

  // we assume the datetime format is German date format
  // as TT.MM.JJJJ / DD.MM.YYYY
  getTimestampFromDate: (dateString, splitter = '.') => {
    let dateParts = dateString.split('.')

    let newDate = dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]
    return Math.ceil(new Date(newDate).getTime() / 1000)
  },

  /**
   *
   * @param {Boolean} authenticated
   * @param {String} contentType json|plain
   * @param {String} authenticationType Bearer|Basic
   */
  prepareHeaders: async (authenticated, contentType = 'json', authenticationType = 'Bearer') => {
    let headers = {}

    if (authenticated === true) {
      let userToken = await AsyncStorageService.fetch('usertoken')
      headers.Authorization = authenticationType + ' ' + userToken
    }

    if (contentType === 'json') {
      headers['Content-Type'] = Constants.CONTENT_TYPE_JSON
    }

    return headers
  },

  /**
   * Validate the email string
   * @param {string} email
   */
  isValidEmail: email => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  },

  // we set the criteria of a valid password here
  // it should not be null and not empty and
  // at least 4 characters long
  isValidPassword: password => {
    return password !== null && password !== '' && password.length > 4
  },

  isValidGermanDateFormat: date => {
    return /^\d{2}([.])\d{2}\1\d{4}$/.test(date)
  },
}

export default Utilities
