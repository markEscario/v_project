import { SessionStorage } from 'quasar'
export default function () {
  const sessionUser = SessionStorage.getItem('userData')
  return {
    //
    apiUrl: 'http://localhost:8082/project_api',
    users: [],
    usersProjects: [],
    myProjects: [],
    completedProjects: [],
    isLogged: false,
    profileData: {},
    trendsByProject: [],
    loggedUsers: !sessionUser ? {} : sessionUser,
    registerResponse: '',
    loginResponse: '',
    connectionStatus: '',
    submitStatus: ''
  }
}
