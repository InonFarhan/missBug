import bugApp from '../pages/BugIndex.js'
import bugEdit from '../pages/BugEdit.js'
import bugDetails from '../pages/BugDetails.js'
import userPage from '../pages/userPage.js'
import adminSecretPage from '../pages/adminSecretPage.js'

const routes = [
	{ path: '/', redirect: '/bug' },
	{ path: '/bug', component: bugApp },
	{ path: '/bug/edit/:bugId?', component: bugEdit },
	{ path: '/bug/:bugId', component: bugDetails },
	{ path: '/user/:bugId', component: userPage },
	{ path: '/bug/adminSecretPage', component: adminSecretPage },
]

export const router = VueRouter.createRouter({ history: VueRouter.createWebHashHistory(), routes })
