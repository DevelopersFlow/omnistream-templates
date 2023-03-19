import 'reflect-metadata';
import '@shared/containers';
import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import http from 'http';
import socket from 'socket.io';

import 'express-async-errors';

import { env } from '@config/env';
import { uploadConfig } from '@config/upload';
import { handler } from '@shared/errors/Handler';

import { connect } from '../typeorm';
import { routes } from './routes';

const app = express();

const server = http.createServer(app);

const io = new socket.Server(server, { cors: { origin: env.APP_WEB_URL } });

connect();

async function ignition(): Promise<void> {
  // Configurations
  app.use(cors());
  app.use(express.json());

  // Static Files
  app.use('/files', express.static(uploadConfig.uploadsFolder));

  // Rotas
  app.use(routes);
  app.get('/', (req, res) => res.status(200).send('OK'));

  // Errors
  app.use(handler);
}

ignition();

export { server, io };
