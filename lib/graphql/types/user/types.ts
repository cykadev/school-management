import { builder } from '../../builder';
import { UserStatusEnum } from '../../enums';

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    firstName: t.exposeString('firstName'),
    lastName: t.exposeString('lastName'),
    role: t.exposeString('role'),
    status: t.exposeString('status'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),

    organization: t.relation('organization'),

  }),
});

export const UserInput = builder.inputType('UserInput', {
  fields: (t) => ({
    firstName: t.string({ required: true}),
    lastName: t.string({ required: true}),
    email: t.string({ required: true }),
    role: t.string({ required: true }),
    status: t.field({ type: UserStatusEnum, required: false })
  }),
});