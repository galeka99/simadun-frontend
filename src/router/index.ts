import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/stores/app'
import AuthApi from '@/apis/auth'

import LandingPage from '@/views/LandingPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import DashboardIndex from '@/views/dashboard/DashboardIndex.vue'
import DashboardHome from '@/views/dashboard/DashboardHome.vue'
import RoomPage from '@/views/dashboard/RoomPage.vue'
import UserPage from '@/views/dashboard/UserPage.vue'
import UpdatePasswordPage from '@/views/dashboard/UpdatePasswordPage.vue'
import LogoutPage from '@/views/LogoutPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: {
        guest: true,
      },
    },
    {
      path: '/dashboard',
      name: 'dashboardIndex',
      component: DashboardIndex,
      meta: {
        auth: true,
      },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardHome,
        },
        {
          path: 'room',
          name: 'room',
          component: RoomPage,
        },
        {
          path: 'user',
          name: 'user',
          component: UserPage,
        },
        {
          path: 'update-password',
          name: 'updatePassword',
          component: UpdatePasswordPage,
        },
      ],
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutPage,
      meta: {
        auth: true,
      },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  // CHECK GUEST ROUTES
  if (to.meta.guest && localStorage.getItem('token') !== null) {
    return next({ path: '/dashboard' })
  }

  // CHECK AUTH ROUTES
  if (to.meta.auth) {
    try {
      const token = localStorage.getItem('token') ?? ''
      if (token.length === 0) {
        return next({ path: '/login' })
      }

      const app = useAppStore()
      const user = await AuthApi.info()
      app.user = user

      return next()
    } catch (e) {
      console.error('AUTH CHECK ERROR')
      console.error(e)

      localStorage.clear()

      return next({ path: '/login' })
    }
  }

  return next()
})

export default router
