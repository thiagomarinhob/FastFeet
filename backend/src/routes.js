import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryPendingController from './app/controllers/DeliveryPendingController';
import DeliveryCompletedController from './app/controllers/DeliveryCompletedController';
import DeliveryStartController from './app/controllers/DeliveryStartController';
import DeliveryFinishController from './app/controllers/DeliveryFinishController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/users', UserController.index);
routes.post('/sessions', SessionController.store);

routes.get('/deliverymans/:id', DeliveryPendingController.index);
routes.get('/deliverymans/:id/deliveries', DeliveryCompletedController.index);

routes.post(
    '/deliverymans/:id/deliveries/:deliveryId/start',
    DeliveryStartController.store
);

routes.post(
    '/deliverymans/:id/deliveries/:deliveryId/end',
    DeliveryFinishController.store
);

routes.post('/files', upload.single('file'), FileController.store);

routes.use(authMiddleware);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.get('/deliverymans', DeliverymanController.index);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.post('/deliverys', DeliveryController.store);
routes.get('/deliverys', DeliveryController.index);
routes.put('/deliverys/:id', DeliveryController.update);
routes.delete('/deliverys/:id', DeliveryController.delete);

export default routes;
