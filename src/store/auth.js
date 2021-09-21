import axios from 'axios'

export default ({
  namespaced: true,

  state: {
    token: null,
    client: null
  },

  getters: {
    authenticated (state) {
      return state.token && state.client
    },

    client (state) {
      return state.client
    }
  },

  mutations: {
    SET_TOKEN (state, token) {
      state.token = token
    },

    SET_CLIENT (state, client) {
      state.client = client
    }
  },

  actions: {
    async login ({ dispatch }, credentials) {
      await axios.post('/api/auth/login', credentials).then(response => {
        dispatch('attempt', response.data.token)
      })
    },

    async attempt ({ commit, state }, token) {
      if (token) {
        commit('SET_TOKEN', token)
      }
      if (!state.token) {
        return
      }
      try {
        await axios.get('/api/client/me').then(response => {
          commit('SET_CLIENT', response.data)
        })
      } catch (e) {
        commit('SET_TOKEN', null)
        commit('SET_CLIENT', null)
      }
    },

    logout ({ commit }) {
      return axios.post('/api/auth/logout').then(() => {
        commit('SET_TOKEN', null)
        commit('SET_CLIENT', null)
      })
    },

    async client ({ commit }, data) {
      let client
      await axios.get('api/client').then(response => {
        client = response.data
      })
      return client
    },

    async searchInvoices ({ commit }, data) {
      let invoices
      const params = Object.entries(Object.assign({}, data)).map(([key, value]) => `${key}=${value}`).join('&')
      await axios.get('/api/invoice?' + params).then(response => {
        invoices = response.data
      })
      return invoices
    }
  }
})
