/*
  All the GET, PUT, POST and DELETE routes are here.
Also, we have all the middlewares and models being called here.
*/

import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProviderController from './app/controllers/ProviderController';
import FileController from './app/controllers/FileController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

import authMiddleware from './app/middlewares/auth';

const routes = Router();
const upload = multer(multerConfig);

// create users
routes.post('/users', UserController.store);

// create sessions
routes.post('/sessions', SessionController.store);

// all of the routes bellow will use this middleware
routes.use(authMiddleware);

// update users
routes.put('/users', UserController.update);

// listing all providers and available times
routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

// avatar upload
routes.post('/files', upload.single('file'), FileController.store);

// appointment scheduling (listing, creating, cancelling)
routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

// provider's schedule
routes.get('/schedule', ScheduleController.index);

// notifications list
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

export default routes;
