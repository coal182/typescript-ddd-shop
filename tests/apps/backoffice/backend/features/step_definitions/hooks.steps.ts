import {BackofficeBackendApp} from '@backoffice-backend-app/backoffice-backend-app';
import {AfterAll, Before, BeforeAll} from '@cucumber/cucumber';
import {EventBus} from '@shared/domain/event-bus';
import {ContainerBuilder} from 'node-dependency-injection';
import {EnvironmentArranger} from 'tests/contexts/shared/infrastructure/arranger/environment-arranger';

let application: BackofficeBackendApp;
let environmentArranger: EnvironmentArranger;
let eventBus: EventBus;
let container: ContainerBuilder;

BeforeAll({timeout: 2 * 5000}, async () => {
    application = new BackofficeBackendApp();
    await application.start('3001');

    container = application.container;

    environmentArranger = await container.get<Promise<EnvironmentArranger>>('Backoffice.EnvironmentArranger');
    eventBus = await container.get<EventBus>('Backoffice.Shared.domain.EventBus');
    await environmentArranger.arrange();
});

AfterAll({timeout: 2 * 5000}, async () => {
    await environmentArranger.arrange();
    await environmentArranger.close();

    application
        .stop()
        .then(() => console.log('Finishing...'))
        .catch((error) => console.log('Error Finishing', error))
        .finally(() => console.log('Finished'));
});

Before(beforeScenario);

async function beforeScenario(): Promise<void> {
    await environmentArranger.arrange();
}

export {application, environmentArranger, eventBus};
