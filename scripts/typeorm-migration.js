const { spawnSync } = require('node:child_process');

const operation = process.argv[2];
const migrationName = process.env.npm_config_name;

if (!operation || !migrationName) {
  console.error('Usage: npm run migration:create --name=MigrationName');
  process.exit(1);
}

const commandArgs = [
  './node_modules/typeorm/cli-ts-node-commonjs.js',
  '-d',
  './data-source.ts',
  `migration:${operation}`,
  `./src/common/database/migrations/${migrationName}`,
];

const result = spawnSync(process.execPath, commandArgs, {
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
