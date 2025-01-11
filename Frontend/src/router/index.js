import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import CalendarCreate from '../views/CalendarCreate.vue'
import CalendarView from '../views/CalendarView.vue'
import CalendarHome from '../views/CalendarHome.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'CalendarHome',
    component: CalendarHome
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/calendar/create',
    name: 'CalendarCreate',
    component: CalendarCreate,
  },
  
  {
    path: '/calendar/:id',
    name: 'CalendarView',
    component: CalendarView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  next() 
})

export default router
