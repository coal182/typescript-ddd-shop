import {Consumer as KafkaConsumer, Kafka, Producer as KafkaProducer, Admin, KafkaJSProtocolError, EachMessagePayload, Message} from 'kafkajs';

import {KafkaConfig} from './kafka-config';

export class KafkaConnection {
    private kafka: Kafka;
    private admin: Admin;
    private producer: KafkaProducer;
    private consumer: KafkaConsumer;

    constructor(private config: KafkaConfig) {
        this.kafka = new Kafka(config.brokerConfig);
        this.admin = this.kafka.admin();
        this.producer = this.kafka.producer(config.producerConfig);
        this.consumer = this.kafka.consumer(config.consumerConfig);
    }

    async connect(): Promise<void> {
        await this.producer.connect();
        await this.consumer.connect();
        await this.admin.connect();
    }

    async createTopic(topic: string): Promise<void> {
        try {
            await this.admin.createTopics({
                topics: [{topic}],
            });
        } catch (error) {
            if (this.isKafkaError(error)) {
                if (error.code !== 36) {
                    throw error;
                }
            } else {
                throw error;
            }
        }
    }

    async publish(params: {topic: string; messages: Message[]}): Promise<void> {
        const {topic, messages} = params;

        await this.producer.send({
            topic,
            messages,
        });
    }

    async close(): Promise<void> {
        await this.producer.disconnect();
        await this.consumer.disconnect();
        await this.admin.disconnect();
    }

    async consume(subscriptions: {topic: string; onMessage: (message: EachMessagePayload) => void}[]): Promise<void> {
        const topics = subscriptions.map((subscription) => subscription.topic);

        await this.consumer.subscribe({topics});

        await this.consumer.run({
            eachMessage: async ({topic, partition, message, heartbeat, pause}) => {
                const subscriptionsByTopic = subscriptions.filter((s) => s.topic === topic);
                for (const subscription of subscriptionsByTopic) {
                    await subscription.onMessage({topic, partition, message, heartbeat, pause});
                }
            },
        });
    }

    private isKafkaError(error: unknown): error is KafkaJSProtocolError {
        return (error as KafkaJSProtocolError).code !== undefined;
    }
}
