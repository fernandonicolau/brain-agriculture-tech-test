import 'dotenv/config';
import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { getTypeOrmDataSourceOptions } from './src/common/database/typeorm.config';

const AppDataSource = new DataSource(getTypeOrmDataSourceOptions());

export default AppDataSource;
