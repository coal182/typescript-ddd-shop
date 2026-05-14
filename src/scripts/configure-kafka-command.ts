import {DomainEventSubscribers} from '@infrastructure/event-bus/domain-event-subscribers';
import {KafkaConfigurer} from '@infrastructure/event-bus/kafka/kafka-configurer';
import {KafkaConnection} from '@infrastructure/event-bus/kafka/kafka-connection';
import {ContainerBuilder} from 'node-dependency-injection';

export class ConfigureKafkaCommand {
    static async run(container: ContainerBuilder): Promise<void> {
        const connection = container.get<KafkaConnection>('Shared.KafkaConnection');
        await connection.connect();

        const configurer = container.get<KafkaConfigurer>('Shared.KafkaConfigurer');
        const subscribers = DomainEventSubscribers.from(container).items;

        await configurer.configure({subscribers});

        await new Promise((r) => setTimeout(r, 3000));

        await connection.close();
    }
}
