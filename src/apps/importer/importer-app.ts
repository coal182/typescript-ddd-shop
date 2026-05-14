import {KafkaConnection} from '@infrastructure/event-bus/kafka/kafka-connection';
import {CommandBus} from '@shared/domain/command-bus';
import {CreateUserCommand} from '@shop-backend/user/application/commands/create-user';
import {ContainerBuilder} from 'node-dependency-injection';

import {containerFactory} from './dependency-injection';
import {FeedInventoryAggregator} from './feed-inventory-aggregator';
import {FeedParserFromContentType} from './feed-parser-from-content-type';
import {getShopProductsFeed} from './get-shop-products-feed';

export class ImporterApp {
    container: ContainerBuilder;

    async start(): Promise<void> {
        this.container = await containerFactory();
        await this.connectMessageBroker();

        await this.consumeFeed();

        await this.stop();
    }

    async stop(): Promise<void> {
        setTimeout(async () => {
            await this.getMessageBrokerConnection().close().then(process.exit(0));
        }, 20000);
    }

    private async consumeFeed(): Promise<void> {
        const feed = getShopProductsFeed();

        const feedParserFromContentType = new FeedParserFromContentType();
        const parser = feedParserFromContentType.get(feed.contentType);
        const commandBus = this.container.get<CommandBus>('Shared.domain.CommandBus');

        const feedInventoryAggregator = new FeedInventoryAggregator(commandBus, parser);
        await feedInventoryAggregator.run(feed);

        console.log('📝 Creating default user...');
        const createUserCommand: CreateUserCommand = new CreateUserCommand(
            '4b75043b-3d9c-42ad-ac00-8630d8435cd2',
            'niclife7@gmail.com',
            'Cristian',
            'Martin',
            new Date('1991-01-01T00:00:00.000+00:00'),
            '$2a$12$V.1oGxoe2aIhbhIH/DRmxep.wgK.t2z8dujW4Lku5q7VDT24kWMtS',
        );
        commandBus.dispatch(createUserCommand);
    }

    private async connectMessageBroker(): Promise<void> {
        await this.getMessageBrokerConnection().connect();
    }

    private getMessageBrokerConnection(): KafkaConnection {
        return this.container.get<KafkaConnection>('Shared.KafkaConnection');
    }
}
