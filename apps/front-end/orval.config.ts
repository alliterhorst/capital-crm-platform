import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: '../../swagger.json',
      filters: {
        tags: ['auth', 'users', 'clients', 'metrics'],
      },
    },
    output: {
      mode: 'tags-split',
      target: 'src/shared/api/generated',
      schemas: 'src/shared/api/generated/model',
      client: 'react-query',
      override: {
        mutator: {
          path: 'src/shared/api/axios-instance.ts',
          name: 'customInstance',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
