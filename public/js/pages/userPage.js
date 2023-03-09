import { userService } from "../services/user.service.js"
import bugList from '../cmps/BugList.js'
import { bugService } from '../services/bug.service.js'
import adminSecretPage from '../pages/adminSecretPage.js'

export default {
    template: `
        <header>
            <h1>User</h1>   
            <h3>Name: {{loggedinUser.fullname}}</h3>    
        </header>
        <hr />
        <bug-list v-if="bugs"
		:bugs="bugs"
		@removeBug="removeBug"></bug-list>
        <router-link to="/bug/adminSecretPage">Users</router-link>
        <hr />
        <router-link to="/bug">Back</router-link>
    `,
    created() {
        this.loadBugs()
    },
    data() {
        return {
            bugs: '',
            loggedinUser: userService.getLoggedInUser(),
            filterBy: {
                txt: '',
                severity: 0,
                label: '',
                sortType: 'createdAt',
                sortDesc: 1,
                page: 0,
                isUserPage: true,
            },
            totalPages: 0
        }
    },
    methods: {
        loadBugs() {
            bugService.query(this.filterBy).then(({ currBugs, totalPages }) => {
                this.bugs = currBugs
                this.totalPages = totalPages
            })
        },
        removeBug(bugId) {
            bugService.remove(bugId).then(() => this.loadBugs())
        },
    },
    components: {
        bugList,
        adminSecretPage,
    },
}