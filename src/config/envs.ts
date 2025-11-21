import { get } from 'env-var';

export const envs = {
  nodeEnv: get('NODE_ENV').default('dev').asString(),
  port: get('PORT').default(3000).asPortNumber(),
  host: get('HOST').default('localhost').asString(),
  dbUrl: get('DB_URL').default('mongodb://localhost:27017').asUrlString(),
  dbName: get('DB_NAME').default('expense_tracker_dev').asString(),
  jwtSecret: get('JWT_SECRET').default('access-token-secret').asString(),
  jwtExpiresIn: get('JWT_EXPIRES_IN').default(86400).asInt(),
};
