import mime from 'mime'
import S3 from 'aws-sdk/clients/s3'

const s3 = new S3({ apiVersion: '2006-03-01' })

export default {
  upload
}

/**
 * Upload File to S3 Bucket
 * @param key
 * @param body
 */
function upload (bucket, key, body) {
  return new Promise((resolve, reject) => {
    const params = {
      Key: key,
      Body: body,
      Bucket: bucket,
      ACL: 'public-read',
      ContentType: mime.getType(key)
    }
    s3.upload(params, {}, (error, data) => {
      if (error) {
        reject(error.message)
      } else {
        resolve(data)
      }
    })
  })
}
