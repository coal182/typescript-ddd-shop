import 'module-alias/register';
import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import { TYPES } from '@storeback/shared/constants/types';

import { EventBus } from '@core/event-bus';

import { server } from './server';

(async () => {
  const container = await server();
  const baseEventHandler = container.get<EventBus>(TYPES.EventBus);
  baseEventHandler.subscribeEvents();
})();
