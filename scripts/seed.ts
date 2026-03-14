import 'dotenv/config';
import 'reflect-metadata';

import dataSource from '../data-source';
import { Crop } from '../src/modules/agriculture/entities/crop.entity';
import { Farm } from '../src/modules/agriculture/entities/farm.entity';
import { HarvestCrop } from '../src/modules/agriculture/entities/harvest-crop.entity';
import { Harvest } from '../src/modules/agriculture/entities/harvest.entity';
import { Producer } from '../src/modules/agriculture/entities/producer.entity';

type SeedProducer = {
  document: string;
  name: string;
};

type SeedFarm = {
  producerDocument: string;
  name: string;
  city: string;
  state: string;
  totalArea: string;
  arableArea: string;
  vegetationArea: string;
};

type SeedHarvest = {
  farmName: string;
  name: string;
  year: number;
};

type SeedHarvestCrop = {
  harvestName: string;
  cropName: string;
};

const producersSeed: SeedProducer[] = [
  {
    document: '52998224725',
    name: 'Maria da Silva',
  },
  {
    document: '11144477735',
    name: 'Joao Pereira',
  },
  {
    document: '04252011000110',
    name: 'Agro Vale Ltda',
  },
];

const farmsSeed: SeedFarm[] = [
  {
    producerDocument: '52998224725',
    name: 'Fazenda Primavera',
    city: 'Uberaba',
    state: 'MG',
    totalArea: '1200.00',
    arableArea: '850.00',
    vegetationArea: '350.00',
  },
  {
    producerDocument: '11144477735',
    name: 'Sitio Boa Esperanca',
    city: 'Ribeirao Preto',
    state: 'SP',
    totalArea: '900.00',
    arableArea: '650.00',
    vegetationArea: '250.00',
  },
  {
    producerDocument: '04252011000110',
    name: 'Fazenda Horizonte',
    city: 'Sorriso',
    state: 'MT',
    totalArea: '2000.00',
    arableArea: '1500.00',
    vegetationArea: '500.00',
  },
  {
    producerDocument: '04252011000110',
    name: 'Fazenda Santa Luzia',
    city: 'Rio Verde',
    state: 'GO',
    totalArea: '1500.00',
    arableArea: '1000.00',
    vegetationArea: '500.00',
  },
];

const cropsSeed = ['Soja', 'Milho', 'Algodao', 'Cafe', 'Cana-de-acucar'];

const harvestsSeed: SeedHarvest[] = [
  {
    farmName: 'Fazenda Primavera',
    name: 'Safra 2023/2024',
    year: 2023,
  },
  {
    farmName: 'Fazenda Primavera',
    name: 'Safra 2024/2025',
    year: 2024,
  },
  {
    farmName: 'Sitio Boa Esperanca',
    name: 'Safra 2024',
    year: 2024,
  },
  {
    farmName: 'Fazenda Horizonte',
    name: 'Safra Verao 2024/2025',
    year: 2024,
  },
  {
    farmName: 'Fazenda Santa Luzia',
    name: 'Safra 2025',
    year: 2025,
  },
];

const harvestCropsSeed: SeedHarvestCrop[] = [
  { harvestName: 'Safra 2023/2024', cropName: 'Cafe' },
  { harvestName: 'Safra 2024/2025', cropName: 'Milho' },
  { harvestName: 'Safra 2024/2025', cropName: 'Soja' },
  { harvestName: 'Safra 2024', cropName: 'Cana-de-acucar' },
  { harvestName: 'Safra Verao 2024/2025', cropName: 'Algodao' },
  { harvestName: 'Safra Verao 2024/2025', cropName: 'Soja' },
  { harvestName: 'Safra 2025', cropName: 'Milho' },
];

async function seed(): Promise<void> {
  await dataSource.initialize();

  try {
    await dataSource.transaction(async (manager) => {
      await manager.delete(HarvestCrop, {});
      await manager.delete(Harvest, {});
      await manager.delete(Farm, {});
      await manager.delete(Crop, {});
      await manager.delete(Producer, {});

      const producers = await manager.save(
        Producer,
        producersSeed.map((producer) => manager.create(Producer, producer)),
      );

      const producerByDocument = new Map(producers.map((producer) => [producer.document, producer]));

      const farms = await manager.save(
        Farm,
        farmsSeed.map((farm) =>
          manager.create(Farm, {
            producerId: producerByDocument.get(farm.producerDocument)?.id,
            name: farm.name,
            city: farm.city,
            state: farm.state,
            totalArea: farm.totalArea,
            arableArea: farm.arableArea,
            vegetationArea: farm.vegetationArea,
          }),
        ),
      );

      const farmByName = new Map(farms.map((farm) => [farm.name, farm]));

      const crops = await manager.save(
        Crop,
        cropsSeed.map((name) =>
          manager.create(Crop, {
            name,
          }),
        ),
      );

      const cropByName = new Map(crops.map((crop) => [crop.name, crop]));

      const harvests = await manager.save(
        Harvest,
        harvestsSeed.map((harvest) =>
          manager.create(Harvest, {
            farmId: farmByName.get(harvest.farmName)?.id,
            name: harvest.name,
            year: harvest.year,
          }),
        ),
      );

      const harvestByName = new Map(harvests.map((harvest) => [harvest.name, harvest]));

      await manager.save(
        HarvestCrop,
        harvestCropsSeed.map((item) =>
          manager.create(HarvestCrop, {
            harvestId: harvestByName.get(item.harvestName)?.id,
            cropId: cropByName.get(item.cropName)?.id,
          }),
        ),
      );
    });

    console.log('Seed completed successfully.');
    console.log(`Producers: ${producersSeed.length}`);
    console.log(`Farms: ${farmsSeed.length}`);
    console.log(`Harvests: ${harvestsSeed.length}`);
    console.log(`Crops: ${cropsSeed.length}`);
    console.log(`HarvestCrop associations: ${harvestCropsSeed.length}`);
  } finally {
    await dataSource.destroy();
  }
}

void seed();
