import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import prisma from '../prisma';
import { DateTimeResolver } from 'graphql-scalars';
import { User } from '@prisma/client';
import { YogaInitialContext } from 'graphql-yoga';


export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: {
    user: User | null;
    prisma: typeof prisma;
    request: YogaInitialContext['request']; // for request object in resolvers
  };
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [PrismaPlugin],
    prisma: {
      client: prisma,
      filterConnectionTotalCount: true,
      onUnusedQuery: process.env.NODE_ENV === 'production' ? null : 'warn',
    },
});

// scalars
builder.addScalarType('DateTime', DateTimeResolver, {});

builder.queryType({});
builder.mutationType({});