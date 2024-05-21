import {ConfigureRabbitMQCommand} from './configure-rabbitmq-command';

import {containerFactory} from '../dependency-injection';

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
