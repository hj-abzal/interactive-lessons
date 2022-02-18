// @ts-check
/* eslint-disable */

// Пример
// {
//   'Текст': 'К сожалению, ты допустил(а) ошибку. Посмотри на анимацию и подумай, где она могла возникнуть, и попробуй еще раз! У тебя обязательно получится!',
//   __Plain_Name: 'Нервная система: механизм нервного импульса',
//   'Тема': 'getRelation',
//   'Текст (ред)': 'Допущена ошибка. \nПосмотри на анимацию и попробуй еще раз.',
//   'Реплика': 'Реплика25',
//    "normalized": {
//       "__Plain_Name": "kletkaIYeeStroenie",
//       "Реплика": "replica2"
//     }
// }

const { promisify } = require("util");
const { exec: coreExec } = require("child_process");
const exec = promisify(coreExec);
const {
  promises: { rm },
  readFileSync,
} = require("fs");
const { join } = require("path");

const dataPath = process.argv[process.argv.indexOf("--dataPath") + 1];

/**
 * @type {Record<string, any>[]}
 */
const phrases = JSON.parse(readFileSync(dataPath).toString());

const tree = {};
phrases.forEach((phrase) => {
  const theme =
    (phrase.normalized && phrase.normalized.__Plain_Name) ||
    phrase.__Plain_Name;
  const replica =
    (phrase.normalized && phrase.normalized["Реплика"]) || phrase["Реплика"];
  const text = phrase["Текст"];

  if (!(theme in tree)) {
    tree[theme] = {};
  }

  tree[theme][replica] = text;
});

async function main() {
  const tankerPath = join(process.cwd(), "src", "codgen", "tanker");
  await rm(tankerPath, { recursive: true, force: true });

  Object.entries(tree).map(async ([destination, subTree]) => {
    await exec(
      `npx hygen generator post-tanker --destination '${destination}' --data '${JSON.stringify(
        subTree
      )}'`
    );
  });
}

main();
