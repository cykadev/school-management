import { builder } from '../../builder';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { AuthPayload, LoginInput } from './types';
import { GraphQLError } from 'graphql';
import { OrganizationStatus, UserStatus } from '@prisma/client';

builder.queryFields((t) => ({
    me: t.prismaField({
        type: 'User',
        args: {},
        resolve: async (query, _, args, ctx) => {
            return ctx.prisma.user.findUnique({
                where: { id: ctx.user?.id },
                include: {
                    organization: true
                }
            });
        },
    })
}));

builder.mutationFields((t) => ({
    login: t.field({
        type: AuthPayload,
        args: {
            input: t.arg({ type: LoginInput, required: true }),
        },
        resolve: async (_parent, { input }, { prisma, request }) => {
            if (!process.env.JWT_SECRET) {
                throw new GraphQLError('Something went wrong on the server, Please try again later.', {
                    extensions: { code: 'JWT_MISSING' }
                });
            }

            const user = await prisma.user.findUnique({
                where: { email: input.email },
                include: {
                    organization: true
                }
            });

            // user not found or password is incorrect
            if (!user || !(await compare(input.password, user.password))) {
                throw new GraphQLError('Credentials are not valid, Please make sure you\'ve entered the correct login details.', {
                    extensions: { code: 'BAD_USER_INPUT' }
                });
            }

            // check if user status is disable then throw error
            if (user.status === UserStatus.DISABLED) {
                throw new GraphQLError('Your account is deactivated, Please contact your organization for further details.', {
                    extensions: { code: 'ACCOUNT_DISABLED' }
                });
            }

            // check if organization status is disable then throw error
            if (user.organization?.status === OrganizationStatus.DISABLED) {
                throw new GraphQLError('Your organization is disabled, Please contact your organization for further details.', {
                    extensions: { code: 'ORG_ACCOUNT_DISABLED' }
                });
            }

            const token = sign(
                { userId: user.id, userRole: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Set the cookie using the cookieStore from the context's request
            // The cookieStore is made available on the request object by the plugin.

            try {
                // @ts-ignore -- cookieStore appended dynamically by @whatwg-node/server-plugin-cookies plugin
                await request.cookieStore.set({
                    name: 'token',
                    value: token,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
                });
            } catch (error) {
                throw new GraphQLError('Unable to set authentication.', {
                    extensions: { code: 'COOKIE_SET_FAILED' }
                });
            }

            // 4. Return the user or a success message, etc.
            return {
                user,
                message: 'Login successful',
            };

        },
    }),
}));