import {containerFactory as shopContainerFactory} from '@shop-backend-app/dependency-injection';

import {ConfigureKafkaCommand} from './configure-kafka-command';

shopContainerFactory().then((container) => {
    console.log('Shop Kafka Configuration running');

    ConfigureKafkaCommand.run(container)
        .then(() => {
            console.log('Shop Kafka Configuration success');
            process.exit(0);
        })
        .catch((error) => {
            console.log('Shop Kafka Configuration fail', error);
            process.exit(1);
        });
});
