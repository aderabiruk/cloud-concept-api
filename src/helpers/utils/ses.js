import AWS from 'aws-sdk'
import config from '../../config'

AWS.config.update({ region: config.AWS_REGION })

async function sendRawEmail (message) {
  try {
    const sesClient = new AWS.SES({ apiVersion: '2010-12-01' })
    const payload = await sesClient.sendRawEmail({ RawMessage: message }).promise()
    console.log('Send raw email payload:', payload)
    return true
  } catch (err) {
    console.error('Send raw email error:', err.stack)
    return false
  }
}

export default {
  sendRawEmail
}
