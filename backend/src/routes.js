import { Router } from 'express';
import multer from 'multer'
import multerConfig from './config/multer'

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';

import authMiddleware from './app/middleware/auth'

const routes = new Router();
const upload = multer(multerConfig)

routes.get('/users', UserController.index);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.post('/deliverymans', DeliverymanController.store)
routes.put('/deliverymans/:id', DeliverymanController.update)

routes.post('/files', upload.single('file'), FileController.store)

export default routes;
