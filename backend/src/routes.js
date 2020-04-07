import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.get('/users', UserController.index);
routes.post('/sessions', SessionController.store);

export default routes;
