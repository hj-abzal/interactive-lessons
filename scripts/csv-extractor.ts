import csvParser from 'csv-parser';
import * as fs from 'fs';
import {logger} from './logger';
import path from 'path';

const results: any[] = [];

// eslint-disable-next-line
fs.createReadStream(path.resolve(__dirname, './file.csv'))
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        logger.info(results);
        // [
        //   { NAME: 'Daffy Duck', AGE: '24' },
        //   { NAME: 'Bugs Bunny', AGE: '22' }
        // ]
    });
