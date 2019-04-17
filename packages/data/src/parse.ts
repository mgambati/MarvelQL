import Papa, { UnparseObject } from 'papaparse';
import { writeFileSync } from 'fs';
import { getDataset } from './data';

const key = process.argv[2];
const data = getDataset(key);

async function parse() {
  try {
    const csv = await Papa.unparse(data);
    return csv;
  } catch (err) {
    console.error(err);
  }
}

async function syncFile() {
  try {
    return await writeFileSync(
      `./${key}.csv`,
      Papa.unparse({ fields: Object.keys(data[0]), data }),
    );
  } catch (err) {
    console.error(err);
  }
}

syncFile();
