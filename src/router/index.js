import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// 表格组件
// import tableRouter from './modules/table'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * 固定路由
 * 没有权限要求的基础界面
 * 所有角色可以访问
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '数据统计', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人信息', icon: 'user', noCache: true }
      }
    ]
  }
]

// /**
//  * 异步路由
//  * 需要根据用户角色动态加载的路由
//  */
// export const asyncRoutes = [
//   // 异步路由
//   {
//     path: '/permission',
//     component: Layout,
//     redirect: '/permission/page',
//     alwaysShow: true, // will always show in the root menu
//     name: 'Permission',
//     meta: {
//       title: '权限控制',
//       icon: 'lock',
//       roles: ['admin', 'editor'] // you can set roles in root nav
//     },
//     children: [
//       {
//         path: 'page',
//         component: () => import('@/views/permission/page'),
//         name: 'PagePermission',
//         meta: {
//           title: 'Page Permission',
//           roles: ['admin'] // or you can only set roles in sub nav
//         }
//       },
//       {
//         path: 'directive',
//         component: () => import('@/views/permission/directive'),
//         name: 'DirectivePermission',
//         meta: {
//           title: 'Directive Permission'
//           // if do not set roles, means: this page does not require permission
//         }
//       },
//       {
//         path: 'menu',
//         component: () => import('@/views/permission/menu'),
//         name: 'MenuPermission',
//         meta: {
//           title: '菜单权限',
//           roles: ['admin']
//         }
//       },
//       {
//         path: 'role',
//         component: () => import('@/views/permission/role'),
//         name: 'RolePermission',
//         meta: {
//           title: '角色权限',
//           roles: ['admin']
//         }
//       }
//     ]
//   },

//   {
//     path: '/error',
//     component: Layout,
//     redirect: 'noRedirect',
//     name: 'ErrorPages',
//     meta: {
//       title: 'Error Pages',
//       icon: '404'
//     },
//     children: [
//       {
//         path: '401page',
//         component: () => import('@/views/error-page/401'),
//         name: 'Page401',
//         meta: { title: '401', noCache: true }
//       },
//       {
//         path: '404',
//         component: () => import('@/views/error-page/404'),
//         name: 'Page404',
//         meta: { title: '404', noCache: true }
//       }
//     ]
//   },

//   // 产品页面路由
//   {
//     path: '/product',
//     component: Layout,
//     redirect: '/product/myself-price-list',
//     name: 'Product',
//     meta: {
//       title: '货单表格',
//       icon: 'table',
//       roles: ['admin']
//     },
//     children: [
//       {
//         path: 'myself-price-list',
//         component: () => import('@/views/product/myself-price-list'),
//         name: 'MyselfPriceList',
//         meta: {
//           title: '自己的货单表格',
//           icon: 'tab',
//           roles: ['admin']
//         }
//       },
//       {
//         path: 'dealer-price-list',
//         component: () => import('@/views/product/dealer-price-list'),
//         name: 'DealerPriceList',
//         meta: {
//           title: '经销商产品价格表',
//           icon: 'tab',
//           roles: ['admin', 'editor']
//         }
//       }
//     ]
//   },

//   // 订单路由
//   {
//     path: '/order',
//     component: Layout,
//     name: 'Order',
//     meta: {
//       title: '入库出库单',
//       icon: 'table'
//     },
//     children: [
//       {
//         path: 'stock-order',
//         component: () => import('@/views/order/stock-order'),
//         name: 'StockOrder',
//         meta: {
//           title: '总体库存',
//           icon: 'list',
//           roles: ['admin']
//         }
//       },
//       {
//         path: 'purchase-order',
//         component: () => import('@/views/order/purchase-order'),
//         name: 'PurchaseOrder',
//         meta: {
//           title: '入库单', icon: 'form', roles: ['admin']
//         }
//       },
//       {
//         path: 'outbound-order',
//         component: () => import('@/views/order/outbound-order'),
//         name: 'OutboundOrder',
//         meta: { title: '出库单', icon: 'money', roles: ['admin'] }
//       }
//     ]
//   },

//   // 就是没匹配上的都进入 404 路由，并且404页面只能放到最下面
//   { path: '*', redirect: '/404', hidden: true }
// ]

const createRouter = () => new Router({
  // 配置路由和组件之间的应用关系
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }), // 切换路由的时候，内容都从顶上开始读
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
