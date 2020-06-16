class Constants {
  static HTTP_METHOD_POST = 'POST'
  static HTTP_METHOD_GET = 'GET'
  static HTTP_METHOD_PUT = 'PUT'
  static HTTP_METHOD_DELETE = 'DELETE'
  static HTTP_METHOD_PATCH = 'PATCH'

  // HTTP status 2xx
  static HTTP_STATUS_OK = 200
  static HTTP_STATUS_CREATED = 201
  static HTTP_STATUS_ACCEPTED = 202
  static HTTP_STATUS_NOT_FOUND = 404

  // HTTP status 4xx
  static HTTP_STATUS_BAD_REQUEST = 400
  static HTTP_STATUS_UNAUTHORIZED = 401
  static HTTP_STATUS_NOT_FOUND = 404

  static CONTENT_TYPE_JSON = 'application/json'

  static AUTH_INVALID_CREDENTIALS = 'Benutzername oder Passwort falsch. Bitte überprüfen Sie Ihre Zugangsdaten.'
  static AUTH_LOGIN_SUCCEEDED = 'Anmeldung erfolgreich'
}

export default Constants
