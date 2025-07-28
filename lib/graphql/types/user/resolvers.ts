import { builder } from '../../builder';
import { UserStatusEnum } from '../../enums';
import { UserInput } from './types';
import { UserStatus } from '@prisma/client';

builder.queryFields((t) => ({
  user: t.prismaField({
    type: 'User',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _, args, ctx) => {
      return ctx.prisma.user.findUnique({
        ...query,
        where: { id: args.id },
      });
    },
  }),
  users: t.prismaField({
    type: ['User'],
    args: {
      status: t.arg({ type: UserStatusEnum, required: false }),
    },
    resolve: async (query, _, args, ctx) => {

      let where: { status?: UserStatus } = {};
      if (args.status) {
        where.status = args.status as UserStatus;
      }

      return ctx.prisma.user.findMany({
        ...query,
        where,
      });
    },
  }),
}));

builder.mutationFields((t) => ({
  createUser: t.prismaField({
    type: 'User',
    args: {
      input: t.arg({ type: UserInput, required: true }),
    },
    resolve: async (query, _, args, ctx) => {
      return ctx.prisma.user.create({
        ...query,
        data: args.input,
      });
    },
  }),
}));