'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/capstone2db';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-capstone2db';
exports.PORT = process.env.PORT || 3000;
exports.JWT_SECRET = 'somesecret';