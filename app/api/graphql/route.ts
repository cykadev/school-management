import { createYoga, YogaInitialContext } from 'graphql-yoga';
import { useCookies } from '@whatwg-node/server-plugin-cookies'
import { schema } from '@/lib/graphql/schema';
import prisma from '../../../lib/prisma';
import { verify } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { permissions } from '../../../lib/auth/sheild';
import { applyMiddleware } from 'graphql-middleware';
import { parse } from 'cookie';

// Define the shape of the JWT payload
interface JWTPayload {
  userId?: string;
}

const { handleRequest } = createYoga({
  schema: applyMiddleware(schema, permissions),
  plugins: [useCookies()],
  context: async ({ request }: YogaInitialContext) => {
    const cookies = parse(request.headers.get('cookie') || '');
    const token = cookies?.token;
    let user: User | null = null;

    if (token && process.env.JWT_SECRET) {
      try {
        const payload = verify(token, process.env.JWT_SECRET) as JWTPayload;
        
        user = await prisma.user.findUniqueOrThrow({
          where: {
            id: payload.userId,
          },
        });

      } catch (e) {
        console.error('Invalid or expired token:', e);
      }
    }

    return {
      user,
      prisma,
      request
    };
  },
  graphqlEndpoint: '/api/graphql',
  // healthCheckEndpoint: '/api/health',
  logging: process.env.NODE_ENV === 'development',
  fetchAPI: { Response }
});

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS };