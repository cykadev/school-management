import { builder } from './builder';

export const UserStatusEnum = builder.enumType('UserStatus', {
  values: ['ACTIVE', 'DISABLED'],
});

export const OrganizationStatusEnum = builder.enumType('OrganizationStatus', {
  values: ['ACTIVE', 'DISABLED'],
});