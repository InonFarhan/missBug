export default {
  props: ['bug'],
  template: `<article className="bug-preview">
                <span>🐛</span>
                <h4>{{bug.title}}</h4>
                <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
                <table>
                <thead><tr><td><h5>Labels:</h5></td></tr></thead>
                <tbody v-for="(label,idx) in bug.labels" :key="idx"><tr><td>{{label}}</td></tr></tbody>
                </table>
                <hr/>
                <div class="actions">
                  <router-link :to="'/bug/' + bug._id">Details</router-link>
                  <router-link :to="'/bug/edit/' + bug._id"> Edit</router-link>
                </div>
                <button @click="onRemove(bug._id)">X</button>
              </article>`,
  created() {
    this.time = new Intl.DateTimeFormat('en-GB',
      { dateStyle: 'short', timeStyle: 'short', timeZone: 'Israel' }).format(this.bug.createdAt)
  },
  date() {
    return {
      time: '',
    }
  },
  methods: {
    onRemove(bugId) {
      this.$emit('removeBug', bugId)
    },
  },
}