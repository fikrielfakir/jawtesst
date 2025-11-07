import { Router } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { db } from '../db';
import { users, restaurants } from '@shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? (process.env.NODE_ENV !== 'production' ? 'dev-only-secret-change-me' : undefined);

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required for authentication');
}

interface RegisterRestaurantBody {
  restaurantName: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  cuisineType: string;
  about: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

router.post('/register', async (req, res) => {
  try {
    const { 
      restaurantName, 
      email, 
      phone, 
      address, 
      type, 
      cuisineType, 
      about,
      password,
      firstName,
      lastName 
    }: RegisterRestaurantBody = req.body;

    if (!restaurantName || !email || !phone || !address || !type || !cuisineType || !about) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let userId: string;

    if (existingUser.length > 0) {
      userId = existingUser[0].id;
      
      await db
        .update(users)
        .set({ userType: 'restaurant_owner' })
        .where(eq(users.id, userId));
    } else {
      if (!password) {
        return res.status(400).json({ error: 'Password is required for new account' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [newUser] = await db
        .insert(users)
        .values({
          email,
          password: hashedPassword,
          firstName: firstName || '',
          lastName: lastName || '',
          phone,
          userType: 'restaurant_owner',
        })
        .returning();

      userId = newUser.id;
    }

    const [restaurant] = await db
      .insert(restaurants)
      .values({
        ownerId: userId,
        name: restaurantName,
        description: about,
        address: address,
        city: 'Unknown',
        country: 'Unknown',
        phone,
        email,
        category: type,
        isActive: false,
      })
      .returning();

    const token = jwt.sign({ userId, email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      message: 'Restaurant registration submitted successfully',
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
      },
      token,
    });
  } catch (error) {
    console.error('Restaurant registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as restaurantsRouter };
