import 'module-alias/register';
import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import { TYPES } from '@constants/types';
import { IEventBus } from '@core/i-event-bus';

import { server } from './server';

(async () => {
  const container = await server();
  const baseEventHandler = container.get<IEventBus>(TYPES.EventBus);
  baseEventHandler.subscribeEvents();
})();
