import {Router} from 'express';
import {createUser, deleteUser, readOneUser, readUser, updateUser,} from "../../controllers/UserController";

const userRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
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
userRouter.post('/', createUser);
/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
userRouter.get('/', readUser);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a single user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: A single user
 */
userRouter.get('/:id', readOneUser);
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
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
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 */
userRouter.put('/:id', updateUser);
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: User not found.
 */
userRouter.delete('/:id', deleteUser);

export default userRouter;
