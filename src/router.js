import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const vueRouter = new Router({
    $breadCrumbs: ['main'],
    mode: "hash",//history mode is not fit for netlify cloud
    routes: [



        {
            path: "/",
            name: "main",
            meta: {
                title: "Home"
            },

            component: () => import("./components/Main"),
            redirect: {name: 'nodes'},
            children: [

                // {
                //     path: "orders",
                //     name: "orders",
                //     meta: {
                //         breads: [{name: 'main', title: 'Home'}, {name: 'order', title: 'Order List'}],
                //         title: "Orders"
                //     },
                //     component: () => import("./components/ListOrders")
                // },


                {
                    path: "users",
                    name: "users",
                    meta: {
                        breads: [{name: 'main', title: 'Home'}, {name: 'user', title: 'User List'}],
                        title: "Users"
                    },
                    component: () => import("./components/ListUsers")
                },
                {
                    path: "nodes",
                    name: "nodes",
                    meta: {
                        breads: [{name: 'main', title: 'Home'}, {name: 'user', title: 'Node List'}],
                        title: "Nodes"
                    },
                    component: () => import("./components/ListNodes")
                },


            ]
        }
    ]
});


export default vueRouter;