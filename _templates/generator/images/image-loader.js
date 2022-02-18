// @ts-check
/* eslint-disable */

const {
  writeFileSync,
  readFileSync,
} = require("fs");


const errorsPath = './errors.txt';

const { promisify } = require("util");
const { join, dirname, basename, extname, resolve } = require("path");
const { exec: coreExec } = require("child_process");


const exec = promisify(coreExec);

const dataPath = process.argv[process.argv.indexOf("--dataPath") + 1];

/**
 * @type {{assetLink: string; path: string[]; link: string; id?: string; ext?: string}[]}
 */
const data = JSON.parse(readFileSync(dataPath).toString());

async function main() {
  const imagesPath = join(process.cwd(), "src", "codgen", "images");

  const sortedData = data.sort((a, b) => {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  });

  /**
   * @type {{[key: string]: number}}
   */
  const savedPaths = {};

  const promises = sortedData
    .map((imageInfo) => {
      let destPath = join(
        imagesPath,
        ...imageInfo.path.slice(0, -1),
        imageInfo.path[imageInfo.path.length - 1] + "." + imageInfo.ext
      );

      const counter = savedPaths[destPath] ?? 0;
      savedPaths[destPath] = counter + 1;

      let fileName = basename(destPath, extname(destPath));

      if (counter) {
        fileName += "_" + counter;
      }

      destPath = join(dirname(destPath), fileName + "." + imageInfo.ext);

      return {
        ...imageInfo,
        destPath,
      };
    })
    .map(async ({ destPath, ...imageInfo }) => {
      /**
       * @type {import('node-fetch').Response}
       */

      return {
        ...imageInfo,
        fsPath: [
          ...imageInfo.path.slice(0, -1),
          basename(destPath, extname(destPath)),
        ],
      };
    });

  const res = await Promise.all(promises);

  const rawPath = resolve(process.cwd(), './_templates/generator/post-images/_images-raw.json');

  writeFileSync(rawPath, JSON.stringify(res));

  await exec(`node '${process.cwd()}/_templates/generator/post-images/after.js' --dataPath ./_images-raw.json`);
}

main()
    .then(() => {
        try {
            writeFileSync(resolve(__dirname, 'ok.txt'), 'ok');
        } catch (e) {
            console.error(e);
        }
    })
    .catch(e => {
        try {
            console.error(e);
            writeFileSync(resolve(__dirname, errorsPath), e.toString());
        } catch (er) {
            console.error(er);
        }
    });
