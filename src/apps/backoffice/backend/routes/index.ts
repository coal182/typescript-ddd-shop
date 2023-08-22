import { Router } from 'express';
import { sync } from 'glob';
import { ContainerBuilder } from 'node-dependency-injection';

export function registerRoutes(router: Router, container: ContainerBuilder) {
  const routes = sync(__dirname + '/**/*.route.*');
  routes.map((route) => register(route, router, container));
}

function register(routePath: string, app: Router, container: ContainerBuilder) {
  const route = require(routePath);
  route.register(app, container);
}
