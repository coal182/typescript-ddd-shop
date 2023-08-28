const common = [
  '--require-module ts-node/register', // Load TypeScript module
  '--require-module tsconfig-paths/register',
];

const shop_backend = [
  ...common,
  'tests/apps/shop/backend/features/**/*.feature',
  '--require tests/apps/shop/backend/features/step_definitions/*.steps.ts',
].join(' ');

const backoffice_backend = [
  ...common,
  'tests/apps/backoffice/backend/features/**/*.feature',
  '--require tests/apps/backoffice/backend/features/step_definitions/*.steps.ts',
].join(' ');

// eslint-disable-next-line no-undef
module.exports = {
  shop_backend,
  backoffice_backend,
};
