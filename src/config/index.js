import dotenv from 'dotenv'

dotenv.config()

const configs = {
  PORT: 8000,
  LOCALE: 'en',
  API_NAME: 'Api',

  // Database Credentials
  DB_URL: process.env.DB_URL || '',

  // AWS Credentials
  AWS_BUCKET: process.env.AWS_BUCKET || '',
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || '',
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || '',
  AWS_REGION: process.env.AWS_REGION || 'us-east-2',

  // Email Configurations
  EMAIL_FROM: process.env.EMAIL_FROM || '',
}

export default Object.assign({}, configs, process.env)
