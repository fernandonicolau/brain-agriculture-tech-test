import { Crop } from '../../modules/agriculture/entities/crop.entity';
import { Farm } from '../../modules/agriculture/entities/farm.entity';
import { HarvestCrop } from '../../modules/agriculture/entities/harvest-crop.entity';
import { Harvest } from '../../modules/agriculture/entities/harvest.entity';
import { Producer } from '../../modules/agriculture/entities/producer.entity';

export const databaseEntities = [Producer, Farm, Harvest, Crop, HarvestCrop];
