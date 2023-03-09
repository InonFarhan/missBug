import usersPreview from './usersPreview.js'

export default {
  props: ['users'],
  template: `
    <section v-if="users.length" className="user-list">     
      <users-preview
      v-for="user in users" :user="user" :key="user._id"/>
    </section>
    <section v-else class="user-list">No users!</section>
    `,
  components: {
    usersPreview,
  },
}