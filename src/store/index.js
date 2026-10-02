import vuex from 'vuex'
import Vue from "vue"
import router from "../router";
import createPersistedState from 'vuex-persistedstate'

Vue.use(vuex)

function addNewRoutes(menuList) {
    console.log("menuList", menuList);
    menuList.forEach(menu => {
        let childRoute = {
            path: '/' + menu.menuclick,
            name: menu.menuname, // 确保 name 唯一
            meta: {
                title: menu.menuname
            },
            component: () => import('../components/' + menu.menucomponent)
        };
        router.addRoute('index', childRoute); // 添加到父路由 'index'
    });
}

export default new vuex.Store({
    state: {
        menu: []
    },
    mutations: {
        setMenu(state, menuList) {
            state.menu = menuList

            addNewRoutes(menuList)
        },
    },
    getters: {
        getMenu(state) {
            return state.menu
        }
    },
    plugins: [createPersistedState()]
})