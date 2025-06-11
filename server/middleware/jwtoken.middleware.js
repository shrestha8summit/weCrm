import jwt from 'jsonwebtoken';
import prisma  from "../prisma/prismaClient.js";

const jwtTokenMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const uid = decoded.uid;
    if (!uid) {
      return res.status(400).json({ message: 'Token payload missing uid' });
    }

    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: {
        id: true,
        //cid: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = {
      uid: user.id,
      //cid: user.cid,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error('JWT error:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export default jwtTokenMiddleware;