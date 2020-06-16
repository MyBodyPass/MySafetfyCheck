import Utilities from '../Utilities'
import Configuration from '../api/Configuration'
import APIService from './APIService'
import Constants from './Constants'

export default class SurveyService {
  /**
   *
   * @param {object} surveyData
   */
  static async postSurvey(surveyData) {
    let apiService = new APIService()

    let headers = await Utilities.prepareHeaders(true, 'json')

    surveyData.queuedTimestamp = Utilities.getCurrentDateTime()
    surveyData.dispatchedTimestamp = Utilities.getCurrentDateTime()

    let request = await apiService.request(
      Configuration.API_POST_SURVEY,
      Constants.HTTP_METHOD_POST,
      headers,
      surveyData,
      true,
    )

    return request
  }
}
