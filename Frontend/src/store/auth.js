const authModule = {
    namespaced: true,
    state: {
      isLoggedIn: !!localStorage.getItem('token'),
      user: null,
      token: localStorage.getItem('token'),
    },
    mutations: {
      setLoginState(state, { user, token }) {
        state.isLoggedIn = true
        state.user = user
        state.token = token
      },
      clearLoginState(state) {
        state.isLoggedIn = false
        state.user = null
        state.token = null
      },
    },
    actions: {
      async login({ commit }, credentials) {
        try {
          const response = await axios.post('/auth/login', credentials)
          const { user, token } = response.data
          commit('setLoginState', { user, token })
          localStorage.setItem('token', token)
          return true
        } catch (error) {
          console.error('Login failed:', error)
          return false
        }
      },
      logout({ commit }) {
        commit('clearLoginState')
        localStorage.removeItem('token')
      },
    },
  }
  
  export default authModule
  