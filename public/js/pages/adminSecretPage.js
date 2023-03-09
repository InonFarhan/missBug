import { userService } from "../services/user.service.js"
import userList from '../cmps/userList.js'

export default {
    template: `
        <header>
             <h1>Users</h1>
        </header>
        <user-list v-if="users"
		:users="users"></user-list>
        `,
    created() {
        userService.query()
            .then(users => this.users = users)
    },
    data() {
        return {
            users: '',
        }
    },
    components: {
        userList,
    },
}