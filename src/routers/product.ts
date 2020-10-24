import express from 'express'

import {
  createProduct,
  findById,
  deleteProduct,
  findAll,
  updateProduct,
  findPaginated,
} from '../controllers/product'
import checkRole from '../middlewares/checkRole'
import checkAuth from '../middlewares/checkAuth'

const router = express.Router()

router.route('/')
  .get(findPaginated)
  .post([checkAuth, checkRole('admin')], createProduct)

router.get('/all', findAll)

router.route('/:productId')
  .get(findById)
  .put([checkAuth, checkRole('admin')], updateProduct)
  .delete([checkAuth, checkRole('admin')], deleteProduct)

export default router
