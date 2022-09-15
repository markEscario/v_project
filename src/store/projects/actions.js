import axios from "axios";
import { SessionStorage } from 'quasar'

export async function getSystemUsers(context) {
  try {
    const response = await axios.get(`${this.state.projects.apiUrl}/users`)
    context.commit('setUsers', response.data)
    return response
  } catch (err) {
    console.log(err);
    return err
  }
}
export async function getUsersProjects(context) {
  try {
    const response = await axios.get(`${this.state.projects.apiUrl}/projects`)
    context.commit('setUsersProjects', response.data)
    return response.data
  } catch (err) {
    console.log(err);
    return err
  }
}
export async function getCompletedProjects(context) {
  try {
    const response = await axios.get(`${this.state.projects.apiUrl}/completed_projects`)
    context.commit('setCompletedProjects', response.data)
    return response.data
  } catch (err) {
    console.log(err);
    return err
  }
}
export async function getMyProjects(context, payload) {
  try {
    const response = await axios.get(`${this.state.projects.apiUrl}/my_projects?user_code=${payload}`)
    context.commit('setMyProjects', response.data)
    return response.data
  } catch (err) {
    console.log(err);
    return err
  }
}
export async function searchUserProjects(context, payload) {
  try {
    const response = await axios.get(`${this.state.projects.apiUrl}/search_projects?filter_params=${payload.searchData}`)
    context.commit('setUsersProjects', response.data)
    return response.data
  } catch (err) {
    console.log(err);
    return err
  }
}
export async function searchCompletedProjects(context, payload) {
  try {
    const response = await axios.get(`${this.state.projects.apiUrl}/search_completed_projects?filter_params=${payload.searchData}`)
    context.commit('setCompletedProjects', response.data)
    return response.data
  } catch (err) {
    console.log(err);
    return err
  }
}
export async function searchSystemUsers(context, payload) {
  try {
    const response = await axios.get(`${this.state.projects.apiUrl}/search_system_users?filter_params=${payload.searchData}`)
    context.commit('setUsers', response.data)
    return response.data
  } catch (err) {
    console.log(err);
    return err
  }
}
export async function register(context, payload) {
  try {
    console.log('payload: ', payload)
    const response = await axios.post(`${this.state.projects.apiUrl}/register`, payload)
    console.log('reg result: ', response.data)
    context.commit('setRegisterResponse', response.data)
    return response
  } catch (err) {
    console.log(err);
    return err
  }
}
export async function handleLogin(context, payload) {
  try {
    console.log('login payload: ', payload)
    const response = await axios.post(`${this.state.projects.apiUrl}/sign_in`, payload)

    if (response.data.accessToken) {
      SessionStorage.set('userData', response.data)
      context.commit('setProfileData', response.data)
      let userData = SessionStorage.getItem('userData')
      if (userData.accessToken) {
        context.commit('setLoggedUsers', userData)
        context.commit('setIsLogged', true)
      }
    } else {
      context.commit('setLoginResponse', response.data)
    }
    return response
  } catch (err) {
    console.log(err);
    return err
  }
}
export async function getProfile(context, payload) {
  try {
    const response = await axios.get(`${this.state.projects.apiUrl}/profile?id=${payload}`)
    context.commit('setProfileData', response.data[0])
    return response.data[0]
  } catch (err) {
    console.log(err);
    return err
  }
}
export async function logOut(context) {
  sessionStorage.removeItem('userData')
  context.commit('setIsLogged', false)
}

export async function assignProject(context, payload) {
  try {
    console.log('payload: ', payload)
    const response = await axios.post(`${this.state.projects.apiUrl}/assign_projects`, payload)
    console.log('reg result: ', response.data)
    context.commit('setSubmitStatus', response.status)
    return response
  } catch (err) {
    console.log(err);
    return err
  }
}

export async function createComment(context, payload) {
  try {
    console.log('payload: ', payload)
    const response = await axios.post(`${this.state.projects.apiUrl}/create_comment`, payload)
    console.log('reg result: ', response.data)
    context.commit('setSubmitStatus', response.status)
    return response
  } catch (err) {
    console.log(err);
    return err
  }
}
export async function getTrends(context, payload) {
  try {
    console.log('trend code : ', payload)
    const response = await axios.get(`${this.state.projects.apiUrl}/trends?project_code=${payload}`)
    context.commit('setTrendsByProject', response.data)
    console.log('trends: ', response.data)
    return response.data
  } catch (err) {
    console.log(err);
    return err
  }
}
export async function updateProject(context, payload) {
  try {
    console.log('u payload: ', payload)
    const response = await axios.put(`${this.state.projects.apiUrl}/projects/${payload.id}`, payload)
    console.log('reg result: ', response.data)
    context.commit('setSubmitStatus', response.status)
    return response
  } catch (err) {
    console.log(err);
    return err
  }
}

export async function deleteProject(context, payload) {
  try {
    console.log('d payload: ', payload)
    const response = await axios.delete(`${this.state.projects.apiUrl}/projects/${payload.id}`)
    context.commit('setSubmitStatus', response.status)
    return response
  } catch (err) {
    console.log(err);
    return err
  }
}

export async function editProfile(context, payload) {
  try {
    const response = await axios.post(`${this.state.projects.apiUrl}/update_profile`, payload)
    console.log('edit: ', response.data)
    context.commit('setRegisterResponse', response.data)
    return response
  } catch (err) {
    console.log(err);
    return err
  }
}