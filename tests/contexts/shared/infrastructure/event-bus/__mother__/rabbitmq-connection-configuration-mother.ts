import {ConnectionSettings} from '@infrastructure/event-bus/rabbitmq/connection-settings';
import {ExchangeSetting} from '@infrastructure/event-bus/rabbitmq/exchange-setting';

export class RabbitMQConnectionConfigurationMother {
    static create(): {
        connectionSettings: ConnectionSettings;
        exchangeSettings: ExchangeSetting;
    } {
        return {
            connectionSettings: {
                username: 'guest',
                password: 'guest',
                vhost: '/',
                connection: {
                    secure: false,
                    hostname: 'localhost',
                    port: 5672,
                },
            },
            exchangeSettings: {name: ''},
        };
    }
}
