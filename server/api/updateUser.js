import express from 'express';
import prisma from '../prisma/prismaClient.js';

const router = express.Router();

router.get('/user/:id', async (req, res) => {
  
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  
});

router.put('/user/:id', async (req, res) => {
  
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updatedUser);
 
});

export default router;
