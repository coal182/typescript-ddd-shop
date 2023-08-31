// eslint-disable-next-line no-undef
db.createUser({
  user: 'mongouser',
  pwd: 'super-secret-password',
  roles: [
    { role: 'readWrite', db: 'shop' },
    { role: 'readWrite', db: 'shop_test' },
    { role: 'read', db: 'shop' },
    { role: 'read', db: 'shop_test' },
  ],
});
