import express, { request, response } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import parameterChecking from './controller/util';


import PointsController from './controller/pointsController';
import ItemsController from './controller/itemsController';

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

// List items
routes.get('/items', itemsController.index);

// List points using some filters, such as: city, uf and list of items
routes.get('/points', pointsController.index);

// Specific point by id
routes.get('/points/:id', pointsController.show);

// Create a new collect point
routes.post('/points', 
    upload.single('image'),
    parameterChecking,
    pointsController.create
);

export default routes;