import { builder } from './builder';

import './enums';

import './types/auth/types';
import './types/auth/resolvers';

import './types/user/types';
import './types/user/resolvers';

import './types/organization/types';
import './types/organization/resolvers';


export const schema = builder.toSchema();