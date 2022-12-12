
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/reserva/:id', name: 'reserva', component: () => import('pages/user/reservaPage.vue') },
      { path: '/sessoes/:id', name: 'sessoes', component: () => import('pages/user/sessoesPage.vue') },
      { path: '/cSessoes/:id', name: 'csessoes', component: () => import('pages/user/cSessoesPage.vue') },
      { path: '/edit-reserva', name: "edit-reserva", component: () => import('pages/user/editReservaPage.vue')}
    ]
  },

  {
    path: '/admin',
    component: () => import('layouts/loginLayout.vue'),
    children: [
      { path: '', name: "login", component: () => import('pages/admin/loginPage.vue') },
      { path: '/reset-password', name: "reset-password", component: () => import('pages/admin/reset-passwordPage.vue') },
    ]
  },


  {
    path: '/admin',
    component: () => import('layouts/MainLayoutAdmin.vue'),
    children: [
      { path: '/home',name: "home", component: () => import('pages/admin/principalPage.vue') },
      { path: '/sessoes',name: "sessoes", component: () => import('pages/admin/sessoesListPage.vue') },
      { path: '/filmes',name: "filmes", component: () => import('pages/admin/filmesListPage.vue') },
      { path: '/cinames',name: "cinemas", component: () => import('pages/admin/cinemasListPage.vue') },
      { path: '/ver-lugar/:id', name: 'ver-lugar', component: () => import('pages/admin/ver-lugarListPage.vue') },
      { path: '/reservas',name: "reservas", component: () => import('pages/admin/reservasListPage.vue') },
      { path: '/historico',name: 'historico', component: () => import('pages/admin/historicoListPage.vue') },
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
