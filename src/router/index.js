import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Dashboard from '@/components/Dashboard'
import Login from '@/components/Auth/Login'
import Quiz from '@/components/Quiz'
import Question from '@/components/Question'
import QuizShow from '@/components/QuizShow'
import Join from '@/components/Join'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/quiz/:quiz',
      name: 'Quiz',
      component: Quiz
    },
    {
      path: '/questions/:question',
      name: 'Question',
      component: Question
    },
    {
      path: '/quiz/:quiz/show',
      name: 'QuizShow',
      component: QuizShow
    },
    {
      path: '/join',
      name: 'Join',
      component: Join
    }
  ]
})
