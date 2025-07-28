import { builder } from '../../builder';
import { OrganizationStatusEnum } from '../../enums';
import { OrganizationCreateInput } from './types';
import { OrganizationStatus } from '@prisma/client';

builder.queryFields((t) => ({
  organization: t.prismaField({
    type: 'Organization',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _, args, ctx) => {
      return ctx.prisma.organization.findUnique({
        ...query,
        where: { id: args.id },
      });
    },
  }),
  organizations: t.prismaField({
    type: ['Organization'],
    args: {
      status: t.arg({ type: OrganizationStatusEnum, required: false }),
    },
    resolve: async (query, _, args, ctx) => {
      let where: { status?: OrganizationStatus } = {};
      if (args.status) {
        where.status = args.status as OrganizationStatus;
      }

      return ctx.prisma.organization.findMany({
        ...query,
        where,
      });
    },
  }),
}));

builder.mutationFields((t) => ({
  createOrganization: t.prismaField({
    type: 'Organization',
    args: {
      input: t.arg({ type: OrganizationCreateInput, required: true }),
    },
    resolve: async (query, _, args, ctx) => {
      return ctx.prisma.organization.create({
        ...query,
        data: args.input,
      });
    },
  }),
}));