/*
  Sessions Tokens' Configurations, like the secret hash
and the Token's expire date.

  The secret hash was generated in https://www.md5.cz
*/

export default {
  secret: process.env.APP_SECRET,
  expiresIn: '7d',
};
