import 'dotenv/config';
import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { getTypeOrmOptions } from './src/common/database/typeorm.config';

export default new DataSource(getTypeOrmOptions());
