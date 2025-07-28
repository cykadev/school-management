import type { CodegenConfig } from '@graphql-codegen/cli';
import { printSchema } from 'graphql';
import { schema } from './lib/graphql/schema';

const config: CodegenConfig = {
  schema: printSchema(schema),
  documents: ['app/**/*.tsx'],
  generates: {
    './lib/graphql/__generated__/': { // Output directory for generated types
      preset: 'client', // This preset includes common plugins for client-side (typescript, typescript-operations, typed-document-node)
      plugins: [], // You can add specific plugins here if needed, like @graphql-codegen/typescript-urql
      config: {
        useTypeImports: true,
        withHooks: false, // For generating Urql hooks
        withComponent: false, // You probably don't need components for Urql, but might for Apollo
        withHOC: false, // Same as above
      },
      // Specifically for Urql:
      presetConfig: {
        urqlFragments: true, // Ensures fragments are properly typed for Urql
        // If you need more specific Urql config, you might use the @graphql-codegen/urql plugin directly instead of relying solely on 'client' preset with its default Urql integration.
        // For example:
        // plugins: ['typescript', 'typescript-operations', '@graphql-codegen/typescript-urql']
        enumAsTypes: true, // If you want enums to be generated as types instead of enums
      }
    },
    './lib/graphql/__generated__/schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
  ignoreNoDocuments: true, // Ignore if no GraphQL documents are found
  hooks: {
    afterAllFileWrite: ['prettier --write'], // Format generated files
  },
};

export default config;