import express from 'express'

import {
  addProduct,
  getCart,
  removeProduct,
  findAll
} from '../controllers/cart'
import checkAuth from '../middlewares/checkAuth'
import checkRole from '../middlewares/checkRole'

const router = express.Router()

router.route('/')
  .get([checkAuth], getCart)
  .put([checkAuth], addProduct)
  .delete([checkAuth], removeProduct)

router.get('/all', [checkAuth, checkRole('admin')], findAll)

export default router
