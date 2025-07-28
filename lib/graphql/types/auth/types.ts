import { builder } from '../../builder';
import { User } from '@prisma/client';

// Define AuthPayloadType interface
interface AuthPayloadType {
  message: string;
  user: User;
}

// Define AuthPayload object type
const AuthPayload = builder.objectRef<AuthPayloadType>('AuthPayload');

// Implement AuthPayload fields
AuthPayload.implement({
  fields: (t) => ({
    message: t.exposeString('message'),
    user: t.prismaField({
      type: 'User',
      resolve: async (query, parent) => parent.user,
    }),
  }),
});

export { AuthPayload }

// Login Input
export const LoginInput = builder.inputType('LoginInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string({ required: true }),
  }),
});