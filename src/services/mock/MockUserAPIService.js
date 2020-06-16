import AppUser from '../../domain/AppUser'

class UserAPIService {
  constructor() {
    this.users = {
      user_xsq: JSON.stringify(new AppUser(101, 'xsewqw', 'anonymous')),
      user_xqadf: JSON.stringify(new AppUser(101, 'xsewqw', 'registered')),
    }
  }

  async getProfile(userId) {
    return Promise.resolve(this.users.user_xsq)
  }
}

export default UserAPIService
