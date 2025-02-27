import Vuex from 'vuex';
import Vue from 'vue';
import service from "./libs/request";

Vue.use(Vuex);


export default new Vuex.Store({
    state: {
        widthTableColId: '120',
        formLabelWidth: '120px',
        user: null,
        loading: false,
        userPage: null,
        meta: null,
        todoCount: 0,//待审批信息数量
    },
    getters: {
        getToken() {
            return 'unchain.people.from.censorship.and.surveillance'//todo::
        },
        getMeta(state) {
            return state.meta
        },
        getUser(state) {
            return state.user
        },
        getJwt(state) {
            let user = state.user
            if (user) {
                return user.jwt
            }
            return ''
        },

        getUserList(state) {
            let up = state.userPage;
            if (!up) {
                return []
            }
            return state.userPage.list || []
        },
        getVersion(state) {
            return state.meta ? state.meta.version : []
        },
        getLoading(state) {
            return state.loading
        },

        isAdmin(state, getters) {
            let user = getters.getUser
            return user ? user.role === 'admin' : false
        },
        getNavi(state, getters) {
            let user = getters.getUser
            if (user && user.role === 'admin') {
                return menuUser
            }
            return menuUser
        }
    },
    mutations: {
        setUserPage(state, page) {
            state.userPage = page
        },
        setMeta(state, obj) {
            state.meta = obj
        },
        setUser(state, user) {
            state.user = user
        },
        setLoading(state, obj) {
            state.loading = obj
        },
    },
    actions: {
        async fetchMeta({commit}) {
            await service.get("/api/meta").then(res => {
                if (res) {
                    commit('setMeta', res)
                }
            })
        },
        fetchUserList({commit}, q) {
            service.get("/api/user", {params: q}).then(res => {
                commit('setUserPage', res)
            })
        },

    },
});


const menuUser = [

    {
        txt: 'Information',
        icon: 'el-icon-c-scale-to-original',
        subs: [
            {path: '/users', txt: 'Users', name: 'Users'},
            {path: '/nodes', txt: 'Nodes', name: 'Nodes'},
            {path: '/usages', txt: 'Usages', name: 'Usages'},
        ]
    },
    // {
    //     txt: 'Statistics',
    //     icon: 'el-icon-user',
    //     subs: [
    //         {path: '/users', txt: 'Users', name: 'Users'},
    //         {path: '/nodes', txt: 'Nodes', name: 'Nodes'},
    //     ]
    // },

]
