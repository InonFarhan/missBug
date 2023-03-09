'use strict'

import { bugService } from '../services/bug.service.js'

export default {
  template: `
    <section v-if="bug" class="bug-details">
        <h1>{{bug.title}}</h1>
        <p>{{bug.description}}</p>
        <h5> {{ time }}</h5 >
        <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
        <table>
        <thead><tr><td><h5>Labels:</h5></td></tr></thead>
        <tbody v-for="(label,idx) in bug.labels" :key="idx"><tr><td>{{ label }}</td></tr></tbody>
        </table >
        <hr/>
        <router-link to="/bug">Back</router-link>
    </section>
    `,
  created() {
    const { bugId } = this.$route.params
    if (bugId) {
      bugService.getById(bugId).then((bug) => {
        this.bug = bug

        this.time = new Intl.DateTimeFormat('en-GB',
          { dateStyle: 'short', timeStyle: 'short', timeZone: 'Israel' }).format(this.bug.createdAt)
      })
    }
  },
  data() {
    return {
      bug: null,
      time: '',
    }
  },
}
