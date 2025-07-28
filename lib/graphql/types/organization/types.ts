import { builder } from '../../builder';
import { OrganizationStatusEnum } from '../../enums';

builder.prismaObject('Organization', {
  fields: (t) => ({

    // fields
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    status: t.exposeString('status'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),

    // relations
    users: t.relation('users'),

  }),
});

export const OrganizationCreateInput = builder.inputType('OrganizationCreateInput', {
  fields: (t) => ({
    name: t.string({ required: true}),
    status: t.field({ type: OrganizationStatusEnum, required: false })
  }),
});