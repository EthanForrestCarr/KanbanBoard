import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET_KEY as string, {
      expiresIn: '1h',
    });

    return res.json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
};

const router = Router();
router.post('/login', login);

export default router;