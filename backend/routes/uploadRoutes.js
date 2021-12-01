import path from 'path'
import express from 'express'
import multer from 'multer'

const router = express.Router()

//create disk engine
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

//check file type
const checkFileType = (file, cb) => {
  //allowed file extension
  const filtTypes = /jpg|jpeg|png/
  //check file extension
  const extname = filtTypes.test(path.extname(file.originalname).toLowerCase())
  //check file mimetype
  const mimetype = filtTypes.test(file.mimetype)
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('noly image allowed'))
  }
}

//upload file
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

//file upload route
router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`)
})

export default router