## return-cache

It takes an async function/promise and returns data from existing file cache or if no cache exists, it creates cache as JSON file for next use.

## Install

`npm install return-cache`

## Usage

```js

const makeReturnCache = require('return-cache');

/*
  moduleDirectory is optional. default: 'cache-directory'
*/
const moduleDirectory = 'example';

/*
  rootDirectory is optional. default: './node_modules/return-cache/'
*/
const rootDirectory = __dirname;

const returnCache = makeReturnCache(moduleDirectory, rootDirectory);

const exampleAsyncFunction = async () => {
  const promiseSleep = new Promise((resolve, reject) => {
    setTimeout(() => resolve('this is an example'), 1000);
  });
  return await promiseSleep;
};

returnCache(exampleAsyncFunction) // Async Function/Promise
.then(result => console.log(result))
.catch(err => console.log(err));

```