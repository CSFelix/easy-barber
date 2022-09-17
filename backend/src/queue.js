/*
  This file, like 'server.js', is used to just run
the application in Development Environment and not in
Debug one.

  However, unlike 'server.js', this file runs the Redis
Queues and not the back-end application.

  As far the Redis Queues are processed in a different server
instance as the application, we gotta import the env variables
here too, by importing the 'doenv/config' library.
*/

import 'dotenv/config';

import Queue from './lib/Queue';

// the queue is processed in another instance
Queue.processQueue();
