import convict from 'convict';

const importerConfig = convict({
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
  elastic: {
    url: {
      doc: 'The Elastic connection URL',
      format: String,
      env: 'ELASTIC_URL',
      default: 'http://shop-elasticsearch:9200',
    },
    indexName: {
      doc: 'The Elastic index name for this context',
      format: String,
      env: 'ELASTIC_INDEX_NAME',
      default: 'shop_products',
    },
    config: {
      doc: 'The Elastic config for this context',
      format: '*',
      env: 'ELASTIC_CONFIG',
      default: {
        settings: {
          index: {
            number_of_replicas: 0, // for local development
          },
        },
        mappings: {
          properties: {
            id: {
              type: 'keyword',
              index: true,
            },
            name: {
              type: 'text',
              index: true,
              fielddata: true,
            },
            duration: {
              type: 'text',
              index: true,
              fielddata: true,
            },
          },
        },
      },
    },
  },
});

importerConfig.loadFile([__dirname + '/default.json', __dirname + '/' + importerConfig.get('env') + '.json']);

const url: string = importerConfig.get('mongo.url');

export default importerConfig;
