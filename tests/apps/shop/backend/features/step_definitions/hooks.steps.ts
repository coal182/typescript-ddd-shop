import {AfterAll, Before, BeforeAll} from '@cucumber/cucumber';
import {EventBus} from '@shared/domain/event-bus';
import {ShopBackendApp} from '@shop-backend-app/shop-backend-app';
import {ContainerBuilder} from 'node-dependency-injection';
import {EnvironmentArranger} from 'tests/contexts/shared/infrastructure/arranger/environment-arranger';

let application: ShopBackendApp;
let environmentArranger: EnvironmentArranger;
let elasticEnvironmentArranger: EnvironmentArranger;
let eventBus: EventBus;
let container: ContainerBuilder;

BeforeAll({timeout: 2 * 50000}, async () => {
    application = new ShopBackendApp();
    await application.start('5002');

    container = application.container;

    environmentArranger = await container.get<Promise<EnvironmentArranger>>('Shop.EnvironmentArranger');
    elasticEnvironmentArranger = await container.get<Promise<EnvironmentArranger>>('Shop.ElasticEnvironmentArranger');
    eventBus = await container.get<EventBus>('Shop.Shared.domain.EventBus');
    await environmentArranger.arrange();
    await elasticEnvironmentArranger.arrange();
});

AfterAll({timeout: 2 * 5000}, async () => {
    await environmentArranger.arrange();
    await environmentArranger.close();
    await elasticEnvironmentArranger.arrange();
    await elasticEnvironmentArranger.close();

    // application
    //   .stop()
    //   .then(() => console.log('Finishing...'))
    //   .catch((error) => console.log('Error Finishing', error))
    //   .finally(() => console.log('Finished'));
});

Before(beforeScenario);

async function beforeScenario(): Promise<void> {
    await environmentArranger.arrange();
    await elasticEnvironmentArranger.arrange();
}

export {application, eventBus};
