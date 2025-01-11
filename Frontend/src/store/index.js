import { createStore } from 'vuex'
import axios from 'axios'

const store = createStore({
  modules: {
    auth: {
      namespaced: true,
      state: {
        isLoggedIn: false,
        user: null,
        token: null
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
        }
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
        }
      }
    },
    calendar: {
      namespaced: true,
      state: {
        calendars: [],
        currentCalendar: null,
        events: []
      },
      mutations: {
        setCalendars(state, calendars) {
          state.calendars = calendars
        },
        setCurrentCalendar(state, calendar) {
          state.currentCalendar = calendar
        },
        setEvents(state, events) {
          state.events = events
        },
        addEvent(state, event) {
          state.events.push(event)
        },
        updateEvent(state, updatedEvent) {
          const index = state.events.findIndex(e => e.id === updatedEvent.id)
          if (index !== -1) {
            state.events.splice(index, 1, updatedEvent)
          }
        },
        deleteEvent(state, eventId) {
          state.events = state.events.filter(e => e.id !== eventId)
        }
      },
      actions: {
        async fetchCalendars({ commit }) {
          try {
            const response = await axios.get('/api/calendars')
            commit('setCalendars', response.data)
          } catch (error) {
            console.error('Failed to fetch calendars:', error)
          }
        },
        async createCalendar({ commit }, calendarData) {
          try {
            const response = await axios.post('/api/calendars', calendarData)
            return response.data
          } catch (error) {
            console.error('Failed to create calendar:', error)
            throw error
          }
        },
        async fetchEvents({ commit }, calendarId) {
          try {
            const response = await axios.get(`/api/calendars/${calendarId}/events`)
            commit('setEvents', response.data)
          } catch (error) {
            console.error('Failed to fetch events:', error)
          }
        },
        async createEvent({ commit }, { calendarId, eventData }) {
          try {
            const response = await axios.post(`/api/calendars/${calendarId}/events`, eventData)
            commit('addEvent', response.data)
            return response.data
          } catch (error) {
            console.error('Failed to create event:', error)
            throw error
          }
        },
        async updateEvent({ commit }, { calendarId, eventId, eventData }) {
          try {
            const response = await axios.put(`/api/calendars/${calendarId}/events/${eventId}`, eventData)
            commit('updateEvent', response.data)
            return response.data
          } catch (error) {
            console.error('Failed to update event:', error)
            throw error
          }
        },
        async deleteEvent({ commit }, { calendarId, eventId }) {
          try {
            await axios.delete(`/api/calendars/${calendarId}/events/${eventId}`)
            commit('deleteEvent', eventId)
          } catch (error) {
            console.error('Failed to delete event:', error)
            throw error
          }
        }
      }
    }
  }
})

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default store 