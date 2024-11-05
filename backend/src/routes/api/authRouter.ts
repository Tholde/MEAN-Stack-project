import {Router} from 'express';
import {
    forgetPassword,
    logout,
    resetPassword,
    resetPasswordCode,
    signin,
    signup,
    verification
} from "../../controllers/AuthController";

const authRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and authorization
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The firstname of the user
 *               lastname:
 *                 type: string
 *                 description: The lastname of the user
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password for the user
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
authRouter.post('/signup', signup)
/**
 * @swagger
 * /api/auth/verification:
 *   post:
 *     summary: Verify user email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: number
 *                 description: Code from e-mail, send from admin on signup
 *             required:
 *               - code
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid input
 */
authRouter.post('/verification', verification)
/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password for the user
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       400:
 *         description: Invalid input
 */
authRouter.post('/signin', signin)
/**
 * @swagger
 * /api/auth/forgetPassword:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset requested
 *       400:
 *         description: Invalid input
 */
authRouter.post('/forgetPassword', forgetPassword)
/**
 * @swagger
 * /api/auth/verificationResetPassword:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: The code from user email
 *             required:
 *               - code
 *     responses:
 *       200:
 *         description: Code verified successfully. Try to change your password!
 *       400:
 *         description: Invalid input
 */
authRouter.post('/verificationResetPassword', resetPasswordCode)
/**
 * @swagger
 * /api/auth/resetPassword:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The password for the user
 *               confirm_password:
 *                 type: string
 *                 description: The confirm_password for the user
 *             required:
 *               - password
 *               - confirm_password
 *     responses:
 *       200:
 *         description: Change password successfully.
 *       400:
 *         description: Invalid input
 */
authRouter.post('/resetPassword', resetPassword)
/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Log out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
authRouter.get('/logout', logout)

export default authRouter;
