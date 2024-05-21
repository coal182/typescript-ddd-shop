import {DomainEvent} from '@domain/domain-event';
import {DomainEventSubscriber} from '@domain/domain-event-subscriber';
import {KafkaConfigurer} from '@infrastructure/event-bus/kafka/kafka-configurer';
import {KafkaConnection} from '@infrastructure/event-bus/kafka/kafka-connection';
import {ContainerBuilder} from 'node-dependency-injection';

export class ConfigureKafkaCommand {
    static async run(container: ContainerBuilder): Promise<void> {
        const connection = container.get<KafkaConnection>('Backoffice.Shared.KafkaConnection');
        await connection.connect();

        const configurer = container.get<KafkaConfigurer>('Backoffice.Shared.KafkaConfigurer');
        const subscribers: Array<DomainEventSubscriber<DomainEvent>> = [];

        await configurer.configure({subscribers});
        await connection.close();
    }
}
