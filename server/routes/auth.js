import express from 'express'
import { registerParent, loginUser, registerTherapist, refreshToken, logoutUser, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController.js'

const authRouter = express.Router()

authRouter.post('/registerParent', registerParent)

authRouter.post('/registerTherapist', registerTherapist)

authRouter.get('/verify-email', verifyEmail);

authRouter.post('/forgotPassword', forgotPassword);

authRouter.post('/resetPassword', resetPassword);

authRouter.post('/login', loginUser)

authRouter.post('/refresh', refreshToken)

authRouter.post('/logout', logoutUser)

export default authRouter
