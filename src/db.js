import mongoose from 'mongoose';
import Promise from 'bluebird';
import { config } from 'clipbeard';

const connectionString = config.get('db:mongo:connectionString');
const db = mongoose.connect(connectionString);
export default db;
