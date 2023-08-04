import { RabbitMqConnection } from '@infrastructure/event-bus/rabbitmq/rabbitmq-connection';

export class RabbitMQConnectionDouble extends RabbitMqConnection {
  async publish(params: any): Promise<boolean> {
    throw new Error();
  }
}
