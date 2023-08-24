import convict from 'convict';

const shopConfig = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'dev', 'staging', 'test'],
    default: 'default',
    env: 'NODE_ENV',
  },
  api: {
    port: {
      doc: 'API port',
      format: String,
      default: '5001',
    },
    secret: {
      doc: 'The JWT Secret for auth',
      format: String,
      default: 'jwtsecret',
    },
  },
  mongo: {
    url: {
      doc: 'The Mongo connection URL',
      format: String,
      default: 'mongodb+srv://user:password@clusterX.sbkvX.mongodb.net/bookstore?retryWrites=true&w=majority',
    },
  },
  rabbitmq: {
    connectionSettings: {
      username: {
        doc: 'RabbitMQ username',
        format: String,
        env: 'RABBITMQ_USERNAME',
        default: 'guest',
      },
      password: {
        doc: 'RabbitMQ password',
        format: String,
        env: 'RABBITMQ_PASSWORD',
        default: 'guest',
      },
      vhost: {
        doc: 'RabbitMQ virtual host',
        format: String,
        env: 'RABBITMQ_VHOST',
        default: '/',
      },
      connection: {
        secure: {
          doc: 'RabbitMQ secure protocol',
          format: Boolean,
          env: 'RABBITMQ_SECURE',
          default: false,
        },
        hostname: {
          doc: 'RabbitMQ hostname',
          format: String,
          env: 'RABBITMQ_HOSTNAME',
          default: 'rabbitmq',
        },
        port: {
          doc: 'RabbitMQ amqp port',
          format: Number,
          env: 'RABBITMQ_PORT',
          default: 5672,
        },
      },
    },
    exchangeSettings: {
      name: {
        doc: 'RabbitMQ exchange name',
        format: String,
        default: 'domain_events',
      },
    },
    maxRetries: {
      doc: 'Max number of retries for each message',
      format: Number,
      env: 'RABBITMQ_MAX_RETRIES',
      default: 3,
    },
    retryTtl: {
      doc: 'Ttl for messages in the retry queue',
      format: Number,
      env: 'RABBITMQ_RETRY_TTL',
      default: 1000,
    },
  },
});

shopConfig.loadFile([__dirname + '/default.json', __dirname + '/' + shopConfig.get('env') + '.json']);

const url: string = shopConfig.get('mongo.url');

export default shopConfig;
