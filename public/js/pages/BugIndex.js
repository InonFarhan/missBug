'use strict'
import { bugService } from '../services/bug.service.js'
import bugList from '../cmps/BugList.js'
import bugFilter from '../cmps/BugFilter.js'

export default {
	template: `
    <section class="bug-app">
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter>
		  <button @click="filterBy.sortDesc *= -1; loadBugs()">Sort</button> ||
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
        <bug-list v-if="bugs"
		:bugs="bugs"
		@removeBug="removeBug"></bug-list>
		<button @click="getPage(-1)">Prev</button>
        <button @click="getPage(1)">Next</button>
    </section>
    `,
	data() {
		return {
			bugs: null,
			filterBy: {
				txt: '',
				severity: 0,
				label: '',
				sortType: 'createdAt',
				sortDesc: 1,
				page: 0
			}
		}
	},
	created() {
		this.loadBugs()
	},
	methods: {
		loadBugs() {
			bugService.query(this.filterBy).then((bugs) => this.bugs = bugs)
		},
		setFilterBy(filterBy) {
			this.filterBy = filterBy
			this.loadBugs()
		},
		removeBug(bugId) {
			bugService.remove(bugId).then(() => this.loadBugs())
		},
		getPage(dir) {
			this.filterBy.page += dir
			if (this.filterBy.page < 0) this.filterBy.page = 0
			this.loadBugs()
		},
	},
	components: {
		bugList,
		bugFilter,
	},
}
