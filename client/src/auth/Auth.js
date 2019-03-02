import history from '../history'
import auth0 from 'auth0-js'

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: process.env.REACT_APP_AUTH0_DOMAIN || 'e-invite.auth0.com',
    clientID: process.env.REACT_APP_AUTH0_CLIENTID || 'qno4Yw0uLfwuYuwUkTVtQyq-oHMhjCvZ',
    responseType: 'token id_token',
    scope: 'openid profile email'
  })

  userProfile
  

  constructor () {
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.getAccessToken = this.getAccessToken.bind(this)
    this.getProfile = this.getProfile.bind(this)
  }

  login () {
    this.auth0.authorize(
      {
        redirect_uri: "http://localhost:3000/callback" 
      })
      }

  setSession (authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime())
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
    // // navigate to the dashboard route
    // history.replace('/dashboard')
  }

  getAccessToken () {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      throw new Error('No access token found')
    }
    return accessToken
  }

  setProfile (accessToken) {
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        console.log(profile)
        window.localStorage.setItem('profile', JSON.stringify(profile))
      }
    })
  }

  getProfile (cb) {
    let accessToken = this.getAccessToken()
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile
      }
      cb(err, profile)
    })
  }

  getProfileFromLS () {
    // Retrieves the profile data from window.localStorage
    const profile = window.localStorage.getItem('profile')
    return profile ? JSON.parse(window.localStorage.profile) : {}
  }

  logout () {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    localStorage.removeItem('profile')
    this.userProfile = null
    // navigate to the dashboard route
    history.replace('/logout')
  }

  isAuthenticated () {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  }
}
