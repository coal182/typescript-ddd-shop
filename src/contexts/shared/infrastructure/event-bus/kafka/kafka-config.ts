export interface KafkaConfig {
  brokerConfig: {
    clientId: string;
    brokers: string[];
  };
  producerConfig: {
    transactionalId?: string;
  };
  consumerConfig: {
    groupId: string;
  };
}
