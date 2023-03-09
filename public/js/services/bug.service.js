
export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
}

function query(filterBy = {}) {
  return axios.get(`/api/bug`, { params: filterBy })
    .then(res => res.data)
}

function getById(bugId) {
  return axios.get(`/api/bug/${bugId}`)
    .then(res => res.data)
}

function getEmptyBug() {
  return {
    title: '',
    severity: '',
    description: '',
    createdAt: Date.now(),
    labels: [],
    creator: null
  }
}

function remove(bugId) {
  return axios.delete(`/api/bug/${bugId}`)
    .then(res => res.data)
}

function save(bug) {
  if (bug._id) {
    return axios.put(`/api/bug/${bug._id}`, bug)
      .then(res => res.data)
  } else {
    return axios.post(`/api/bug`, bug)
      .then(res => res.data)
  }
}