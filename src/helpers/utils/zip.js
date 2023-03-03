const zl = require('zip-lib')

function extract (zip, destination) {
  return new Promise((resolve, reject) => {
    zl.extract(zip, destination)
      .then(result => resolve(result))
      .catch(error => reject(error))
  })
}

function zip (folder, destination) {
  return new Promise((resolve, reject) => {
    zl.archiveFolder(folder, destination)
      .then(result => resolve(result))
      .catch(error => reject(error))
  })
}

export default {
  zip,
  extract
}
