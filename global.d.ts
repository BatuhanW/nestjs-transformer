declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;
    KAFKA_BROKERS: string;
    KAFKA_GROUP_ID: string;
    KAFKA_CLIENT_ID: string;
  }
}