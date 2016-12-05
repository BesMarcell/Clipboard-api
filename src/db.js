import mongoose from ‘mongoose’;
import Promise from ‘bluebird’;
import { config } from 'clipbeard';

export default () => {
	const db = mongoose.connect(config.db);
	return db;
};
