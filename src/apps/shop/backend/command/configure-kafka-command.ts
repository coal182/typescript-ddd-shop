import {KafkaConfigurer} from '@infrastructure/event-bus/kafka/kafka-configurer';
import {KafkaConnection} from '@infrastructure/event-bus/kafka/kafka-connection';
import {ContainerBuilder} from 'node-dependency-injection';

import {DomainEventSubscribers} from '../../../../contexts/shared/infrastructure/event-bus/domain-event-subscribers';

export class ConfigureKafkaCommand {
    static async run(container: ContainerBuilder): Promise<void> {
        const connection = container.get<KafkaConnection>('Shop.Shared.KafkaConnection');
        await connection.connect();

        const configurer = container.get<KafkaConfigurer>('Shop.Shared.KafkaConfigurer');
        const subscribers = DomainEventSubscribers.from(container).items;

        await configurer.configure({subscribers});
        //await connection.close();
    }
}
