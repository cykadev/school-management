import { UserRole } from '@prisma/client';
import { rule, shield, and, or, allow } from 'graphql-shield';

export const getCurrentUser = function() {
    return {};
}

// Rules
const isAuthenticated = rule({ cache: 'contextual' })(
  async (_parent, _args, ctx) => !!ctx.user
);

const isGuest = rule({ cache: 'contextual' })(
  async (_parent, _args, ctx) => !ctx.user
);

const isAdmin = rule({ cache: 'contextual' })(
  async (_parent, _args, ctx) => ctx.user?.role === UserRole.ADMIN
);

// const isOwner = rule()(async (parent, args, ctx, info) => {
//   return ctx.user.items.some((id) => id === parent.id)
// })

// Permissions
export const permissions = shield({
  Query: {
    users: isAuthenticated,
    user: isAuthenticated
  },
  Mutation: {
    createUser: and(isAuthenticated, isAdmin),
    createOrganization: and(isAuthenticated, isAdmin),
    login: isGuest,
  }
}, {
  fallbackError: new Error('Not authorized'),
  allowExternalErrors: true
});