import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import SignatureController from './app/controllers/SignatureController';
import OrderController from './app/controllers/OrderController';
import OrderPendingController from './app/controllers/OrderPendingController';
import OrderCompletedController from './app/controllers/OrderCompletedController';
import StartOrderController from './app/controllers/StartOrderController';

import authMiddleware from './app/middleware/auth';
import EndOrderController from './app/controllers/EndOrderController';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/users', UserController.index);
routes.post('/sessions', SessionController.store);

routes.get('/deliverymans/:id', OrderPendingController.index);
routes.get('/deliverymans/:id/deliveries', OrderCompletedController.index);

routes.post(
    '/deliverymans/:id/deliveries/:orderId/start',
    StartOrderController.store
);

routes.post(
    '/deliverymans/:id/deliveries/:orderId/end',
    EndOrderController.store
);

routes.post('/signatures', upload.single('file'), SignatureController.store);

routes.use(authMiddleware);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.get('/deliverymans', DeliverymanController.index);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
