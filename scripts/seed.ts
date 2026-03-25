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

const TOTAL_PRODUCERS = 100;

const firstNames = [
  'Ana',
  'Bruno',
  'Carlos',
  'Daniela',
  'Eduardo',
  'Fernanda',
  'Gabriel',
  'Helena',
  'Igor',
  'Juliana',
  'Kaique',
  'Larissa',
  'Marcelo',
  'Natalia',
  'Otavio',
  'Patricia',
  'Rafael',
  'Simone',
  'Thiago',
  'Vanessa',
];

const lastNames = [
  'Silva',
  'Souza',
  'Oliveira',
  'Santos',
  'Pereira',
  'Costa',
  'Rodrigues',
  'Almeida',
  'Nogueira',
  'Carvalho',
  'Gomes',
  'Ribeiro',
  'Martins',
  'Lima',
  'Barbosa',
];

const citiesByState: Record<string, string[]> = {
  MT: ['Sorriso', 'Sinop', 'Lucas do Rio Verde', 'Primavera do Leste'],
  GO: ['Rio Verde', 'Jatai', 'Mineiros', 'Cristalina'],
  MS: ['Dourados', 'Ponta Pora', 'Maracaju', 'Sidrolandia'],
  MG: ['Uberaba', 'Patos de Minas', 'Unai', 'Patrocinio'],
  SP: ['Ribeirao Preto', 'Franca', 'Barretos', 'Jaboticabal'],
  PR: ['Londrina', 'Cascavel', 'Toledo', 'Maringa'],
  BA: ['Luis Eduardo Magalhaes', 'Barreiras', 'Formosa do Rio Preto', 'Sao Desiderio'],
  RS: ['Passo Fundo', 'Cruz Alta', 'Nao-Me-Toque', 'Santa Rosa'],
};

const states = Object.keys(citiesByState);

const cropsSeed = [
  'Soja',
  'Milho',
  'Algodao',
  'Cafe',
  'Cana-de-acucar',
  'Feijao',
  'Trigo',
  'Sorgo',
];

function pad(value: number, length: number): string {
  return value.toString().padStart(length, '0');
}

function createDocument(index: number): string {
  if (index % 10 === 0) {
    return `54${pad(index, 12)}`;
  }

  return `73${pad(index, 9)}`;
}

function pick<T>(items: T[], index: number): T {
  return items[index % items.length] as T;
}

function toFixedArea(value: number): string {
  return value.toFixed(2);
}

function buildSeedData(): {
  producers: SeedProducer[];
  farms: SeedFarm[];
  harvests: SeedHarvest[];
  harvestCrops: SeedHarvestCrop[];
} {
  const producers: SeedProducer[] = [];
  const farms: SeedFarm[] = [];
  const harvests: SeedHarvest[] = [];
  const harvestCrops: SeedHarvestCrop[] = [];

  for (let index = 1; index <= TOTAL_PRODUCERS; index += 1) {
    const firstName = pick(firstNames, index);
    const lastName = pick(lastNames, index * 2);
    const producerDocument = createDocument(index);
    const producerName =
      index % 10 === 0
        ? `Agro ${firstName} ${lastName} Ltda`
        : `${firstName} ${lastName} ${pad(index, 3)}`;

    producers.push({
      document: producerDocument,
      name: producerName,
    });

    const farmsPerProducer = (index % 4) + 1;

    for (let farmOffset = 1; farmOffset <= farmsPerProducer; farmOffset += 1) {
      const farmNumber = farms.length + 1;
      const state = pick(states, index + farmOffset);
      const city = pick(citiesByState[state] ?? ['Cidade'], index + farmOffset * 3);
      const totalArea = 600 + ((index * 97 + farmOffset * 31) % 2400);
      const arableRatio = 0.52 + ((index + farmOffset) % 18) / 100;
      const arableArea = Number((totalArea * arableRatio).toFixed(2));
      const vegetationArea = Number((totalArea - arableArea).toFixed(2));
      const farmName = `Fazenda ${city} ${pad(farmNumber, 3)}`;

      farms.push({
        producerDocument,
        name: farmName,
        city,
        state,
        totalArea: toFixedArea(totalArea),
        arableArea: toFixedArea(arableArea),
        vegetationArea: toFixedArea(vegetationArea),
      });

      const years = [2023, 2024, 2025].slice(0, (farmNumber % 3) + 1);

      years.forEach((year, yearIndex) => {
        const harvestName =
          year === 2025 ? `Safra ${year} - ${farmName}` : `Safra ${year}/${year + 1} - ${farmName}`;

        harvests.push({
          farmName,
          name: harvestName,
          year,
        });

        const assignedCrops = new Set<string>();
        assignedCrops.add('Milho');
        assignedCrops.add(pick(cropsSeed, index + farmOffset + yearIndex));

        if ((farmNumber + year) % 2 === 0) {
          assignedCrops.add('Soja');
        }

        if ((farmNumber + year) % 5 === 0) {
          assignedCrops.add('Algodao');
        }

        if ((farmNumber + year) % 7 === 0) {
          assignedCrops.add('Feijao');
        }

        Array.from(assignedCrops).forEach((cropName) => {
          harvestCrops.push({
            harvestName,
            cropName,
          });
        });
      });
    }
  }

  return {
    producers,
    farms,
    harvests,
    harvestCrops,
  };
}

async function seed(): Promise<void> {
  const { producers, farms, harvests, harvestCrops } = buildSeedData();

  await dataSource.initialize();

  try {
    await dataSource.transaction(async (manager) => {
      await manager.query(`
        TRUNCATE TABLE
          "harvest_crops",
          "harvests",
          "farms",
          "crops",
          "producers"
        RESTART IDENTITY CASCADE
      `);

      const savedProducers = await manager.save(
        Producer,
        producers.map((producer) => manager.create(Producer, producer)),
      );

      const producerByDocument = new Map(
        savedProducers.map((producer) => [producer.document, producer]),
      );

      const savedFarms = await manager.save(
        Farm,
        farms.map((farm) =>
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

      const farmByName = new Map(savedFarms.map((farm) => [farm.name, farm]));

      const savedCrops = await manager.save(
        Crop,
        cropsSeed.map((name) =>
          manager.create(Crop, {
            name,
          }),
        ),
      );

      const cropByName = new Map(savedCrops.map((crop) => [crop.name, crop]));

      const savedHarvests = await manager.save(
        Harvest,
        harvests.map((harvest) =>
          manager.create(Harvest, {
            farmId: farmByName.get(harvest.farmName)?.id,
            name: harvest.name,
            year: harvest.year,
          }),
        ),
      );

      const harvestByName = new Map(savedHarvests.map((harvest) => [harvest.name, harvest]));

      await manager.save(
        HarvestCrop,
        harvestCrops.map((item) =>
          manager.create(HarvestCrop, {
            harvestId: harvestByName.get(item.harvestName)?.id,
            cropId: cropByName.get(item.cropName)?.id,
          }),
        ),
      );
    });

    console.log('Seed completed successfully.');
    console.log(`Producers: ${producers.length}`);
    console.log(`Farms: ${farms.length}`);
    console.log(`Harvests: ${harvests.length}`);
    console.log(`Crops: ${cropsSeed.length}`);
    console.log(`HarvestCrop associations: ${harvestCrops.length}`);
    console.log(
      'Shared crops example: Milho and Soja are reused across multiple farms and harvests.',
    );
  } finally {
    await dataSource.destroy();
  }
}

void seed();
