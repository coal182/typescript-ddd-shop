const common = [
  '--require-module ts-node/register', // Load TypeScript module
  '--require-module tsconfig-paths/register',
];

const shop_backend = [
  ...common,
  'tests/apps/shop/backend/features/**/*.feature',
  '--require tests/apps/shop/backend/features/step_definitions/*.steps.ts',
].join(' ');

// eslint-disable-next-line no-undef
module.exports = {
  shop_backend,
};
