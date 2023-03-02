import upload from '../middlewares/multer'
import DocxController from '../controllers/Docx.controller'

export default function (app) {
  // Generate Document 
  app.post(
    '/docx/generate',
    DocxController.generate
  )
  // Upload Template
  app.post(
    '/docx/upload-template',
    upload.single('file'),
    DocxController.uploadTemplate
  )
}
