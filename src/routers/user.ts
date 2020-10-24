import express from 'express'

import {
  createUser,
  findById,
  deleteUser,
  findAll,
  updateUser,
  banUser,
  unbanUser,
  authUser
} from '../controllers/user'
import checkAuth from '../middlewares/checkAuth'
import checkRole from '../middlewares/checkRole'

const router = express.Router()

router.get('/', [checkAuth, checkRole('admin')], findAll)
router.route('/:userId')
  .get(checkAuth, findById)
  .put(checkAuth, updateUser)
  .delete(checkAuth, deleteUser)
router.post('/login', authUser)
router.post('/signup', createUser)
router.post('/:userId/ban-user',[checkAuth, checkRole('admin')], banUser)
router.post('/:userId/unban-user', [checkAuth, checkRole('admin')], unbanUser)

export default router
