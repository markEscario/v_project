import axios from "axios";

export async function getUsers(context) {
  try {
    const response = await axios.get('http://localhost:8082/project_api/users')
    context.commit('setUsers', response.data)
    return response
  } catch (err) {
    console.log(err);
    context.commit('setConnectionStatus', err)
  }
}
export async function register(context) {
  try {
    const response = await axios.get('http://localhost:8082/project_api/register')
    return response
  } catch (err) {
    console.log(err);
    context.commit('setConnectionStatus', err)
  }
}