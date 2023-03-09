import LoginSignup from './LoginSignup.js'
import userPage from '../pages/userPage.js'
import { userService } from "../services/user.service.js"

export default {
    template: `
        <header>
            <h1>Miss Bug</h1>    
        </header>
        <hr />
        <section v-if="loggedinUser">
            {{ loggedinUser.fullname }} |
            <router-link :to="'/user/' + loggedinUser._id">
                Profile
            </router-link> |
            <button @click="logout">Logout</button>
        </section>
        <section v-else>
            <LoginSignup @onChangeLoginStatus="changeLoginStatus" />
        </section>
        <hr />
    `,
    data() {
        return {
            loggedinUser: userService.getLoggedInUser()
        }
    },
    methods: {
        changeLoginStatus() {
            this.loggedinUser = userService.getLoggedInUser()
        },
        logout() {
            userService.logout()
                .then(() => {
                    this.loggedinUser = null
                })
        },
    },
    components: {
        LoginSignup,
        userPage
    }
}