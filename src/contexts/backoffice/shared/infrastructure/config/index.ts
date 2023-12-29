import convict from 'convict';

const backofficeConfig = convict({
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
      default: '3000',
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
      default: 'mongodb://shop-mongo/shop?retryWrites=true&w=majority',
    },
    username: {
      doc: 'The Mongo connection user',
      format: String,
      default: 'mongouser',
    },
    password: {
      doc: 'The Mongo connection password',
      format: String,
      default: 'super-secret-password',
    },
  },
  messageBroker: {
    doc: 'Enabled message broker',
    format: ['kafka', 'rabbitmq'],
    default: 'kafka',
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
        env: 'RABBITMQ_EXCHANGE_NAME',
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
  kafka: {
    brokerConfig: {
      clientId: {
        format: String,
        default: 'backoffice-client-id',
      },
      brokers: {
        format: Array,
        default: ['kafka:9092'],
      },
    },
    producerConfig: {
      transactionalId: {
        format: String,
        default: '',
      },
    },
    consumerConfig: {
      groupId: {
        format: String,
        default: 'backoffice-group-id',
      },
    },
  },
});

backofficeConfig.loadFile([__dirname + '/default.json', __dirname + '/' + backofficeConfig.get('env') + '.json']);

export default backofficeConfig;
