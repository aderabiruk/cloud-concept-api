import mkdirp from 'mkdirp'

export default {
  create
}

function create (folder) {
  return new Promise((resolve, reject) => {
    mkdirp(folder)
      .then(result => resolve(result))
      .catch(error => reject(error))
  })
}
