import express from 'express';

import { body } from 'express-validator';

import { login, signup } from '../controller/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.put(
   '/signup',
   [
      body('email')
         .isEmail()
         .withMessage('Entered email is invalid')
         .custom(async (value, { req }) => {
            const userDoc = await User.findOne({ email: value });
            if (userDoc) {
               return Promise.reject('E-mail address already exist');
            }
         })
         .normalizeEmail(),
      body('password').trim().isLength({ min: 6 }),
   ],
   signup
);

router.post('/login', login);

export default router;
