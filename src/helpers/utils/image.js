import jimp from 'jimp'

export default {
  convert
}

function convert (image, output) {
  return new Promise((resolve, reject) => {
    console.log(image)
    console.log(output)
    jimp.read(image, (error, data) => {
      if (error) {
        reject(error)
      } else {
        data.write(output)
        resolve(true)
      }
    })
  })
}
