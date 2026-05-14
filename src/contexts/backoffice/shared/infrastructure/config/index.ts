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
