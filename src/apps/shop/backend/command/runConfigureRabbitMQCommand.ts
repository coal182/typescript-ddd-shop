import { containerFactory } from '../dependency-injection';

import { ConfigureRabbitMQCommand } from './ConfigureRabbitMQCommand';

containerFactory().then((container) => {
  ConfigureRabbitMQCommand.run(container)
    .then(() => {
      console.log('RabbitMQ Configuration success');
      process.exit(0);
    })
    .catch((error) => {
      console.log('RabbitMQ Configuration fail', error);
      process.exit(1);
    });
});
