import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/services/api'
import WelcomeView from '@/views/WelcomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/principal',
      name: 'principal',
      component: () => import('@/views/PrincipalView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/seleccion-ambulancia',
      name: 'seleccion-ambulancia',
      component: () => import('@/views/SeleccionAmbulanciaView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tipo-servicio',
      name: 'tipo-servicio',
      component: () => import('@/views/TipoServicioView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/nombre-responsable',
      name: 'nombre-responsable',
      component: () => import('@/views/NombreResponsableView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/revision',
      name: 'revision',
      component: () => import('@/views/RevisionView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/materiales-faltantes',
      name: 'materiales-faltantes',
      component: () => import('@/views/MaterialesFaltantesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mision-cumplida',
      name: 'mision-cumplida',
      component: () => import('@/views/MisionCumplidaView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/material-gastado',
      name: 'material-gastado',
      component: () => import('@/views/MaterialGastadoView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/sugerencias',
      name: 'sugerencias',
      component: () => import('@/views/SugerenciasView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/todo-listo',
      name: 'todo-listo',
      component: () => import('@/views/TodoListoView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/perfil-admin',
      name: 'perfil-admin',
      component: () => import('@/views/PerfilAdminView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('@/views/PerfilView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/detalle-reposicion/:id',
      name: 'detalle-reposicion',
      component: () => import('@/views/DetalleReposicionView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/historial-reposiciones',
      name: 'historial-reposiciones',
      component: () => import('@/views/HistorialReposicionesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/lista-responsables',
      name: 'lista-responsables',
      component: () => import('@/views/ListaResponsablesView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/ver-revisiones',
      name: 'ver-revisiones',
      component: () => import('@/views/VerRevisionesView.vue'),
      meta: { requiresAuth: true }
    }

  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})

export default router
