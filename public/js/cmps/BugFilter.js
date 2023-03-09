'use strict'

export default {
  template: `
        <section class="bug-filter flex-column">
            <span>Filter by title: </span>
            <input @input="setFilterBy" type="text" v-model="filterBy.txt">

            <label>Filter by severity:</label>
            <input @input="setFilterBy" type="number" v-model="filterBy.severity" min="0" max="3">

            <label>Filter by labels:</label>
              <select @change="setFilterBy" v-model="filterBy.label">
               <option value="critical">critical</option>
               <option value="need-CR">need-CR</option>
               <option value="dev-branch">dev-branch</option>
              </select>
        </section>
    `,
  data() {
    return {
      filterBy: { txt: '', severity: 0, label: '' },
    }
  },
  methods: {
    setFilterBy() {
      this.$emit('setFilterBy', this.filterBy)
    },
  },
}