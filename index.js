const util = require('util');
const fs = require('fs');
const path = require('path');

const makeReturnCache = (moduleDirectory = 'cache-directory', rootDirectory = __dirname) => {
  
  return async (...args) => {

    let [cacheKey, cacheFileName, fn] =
      args.length === 3 ? [args[0], args[1], args[2]] :
      args.length === 2 ? [0, args[0], args[1]] : [0, 'cache', args[0]];

    if(!fn) {
      throw new Error('return-cache function needs at least one argument which must be an async function/promise.');
      return;
    }

    const directoryTemplate = process.env.RETURN_CACHE_DIRECTORY_TEMPLATE ||
      path.join(rootDirectory, '{{module}}');

    const directory = directoryTemplate.replace('{{module}}', moduleDirectory);

    ensureDirectory(directory);

    const file = path.join(directory, `${cacheFileName}.json`);

    const fileExists = fs.existsSync(file);

    const existingStore = fileExists && JSON.parse(await loadString(file));

    if (existingStore.cacheKey === cacheKey) {
      return existingStore.result;
    }

    let result;

    try {
      result = await fn();
    } catch (error) {
      console.error(`Error occurred in argument function. Message: ${error}`);
      return;
    }

    const cacheData = {
      cacheKey,
      result
    };

    const stringToWrite = asPrettyJSON(cacheData);

    await writeString(file, stringToWrite);

    return result;
  }
}

const writeFile = util.promisify(require('fs').writeFile);
const readFile = util.promisify(require('fs').readFile);
const asPrettyJSON = obj => JSON.stringify(obj, null, 2);
const writeString = (filename, string) => writeFile(filename, string, 'utf8');
const loadString = (filename) => readFile(filename, 'utf8');
const ensureDirectory = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory)
  }
}

module.exports = makeReturnCache;