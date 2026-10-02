import VueRouter from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('../components/LoginPage')
    },
    {
        path: '/IndexComponent',
        name: 'index',
        component: () => import('../components/IndexComponent'),
        children: [
            {
                path: '/HomePage',
                name: 'home',
                meta: {
                    title: '首页'
                },
                component: () => import('../components/HomePage'),
            }
        ]
    },
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export function resetRouter() {
    router.matcher = new VueRouter({
        mode: 'history',
        routes: []
    }).matcher
}

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch(err => err)
}
export default router;