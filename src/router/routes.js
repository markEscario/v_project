const routes = [
  {
    path: '/',
    component: () => import('src/pages/SignInPage.vue')
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/projects', component: () => import('pages/ProjectsPage.vue') },
      { path: '/people', component: () => import('pages/PeoplePage.vue') }
    ]
  },
  {
    path: '/registration',
    component: () => import('src/pages/RegistrationPage.vue')
  },
  {
    path: '/profile',
    component: () => import('src/pages/ProfilePage.vue'),
    children: [
      { path: '/edit_profile', component: () => import('pages/EditProfile.vue') },
      { path: '/assignment', component: () => import('pages/AssignmentPage.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
