import { AfterAll, BeforeAll } from '@cucumber/cucumber';
import { ContainerBuilder } from 'node-dependency-injection';

import { EventBus } from '@shared/domain/event-bus';
import { ShopBackendApp } from '@storebackapp/shop-backend-app';
import { EnvironmentArranger } from 'tests/contexts/shared/infrastructure/arranger/environment-arranger';

let application: ShopBackendApp;
let environmentArranger: EnvironmentArranger;
let eventBus: EventBus;
let container: ContainerBuilder;

BeforeAll({ timeout: 2 * 5000 }, async () => {
  application = new ShopBackendApp();
  await application.start('3001');

  container = application.container;

  environmentArranger = await container.get<Promise<EnvironmentArranger>>('Shop.EnvironmentArranger');
  eventBus = await container.get<EventBus>('Shop.Shared.domain.EventBus');
  await environmentArranger.arrange();
});

AfterAll(async () => {
  await environmentArranger.arrange();
  await environmentArranger.close();

  await application.stop();
});

export { application, environmentArranger, eventBus };