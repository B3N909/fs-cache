# @savant/fs-cache

A simple NodeJS library for checking if the contents of a file or directory have changed since the last time the function was called. 

## Installation
```bash
npm install @savant/fs-cache
```

## Usage
```js
const fsCache = require('@savant/fs-cache');
let didChange;

// Initial call
console.log(fsCache.hasChanged('unique-id', '/path/to/directory')); // true

// Subsequent calls
console.log(fsCache.hasChanged('unique-id', '/path/to/directory')); // false

// Changed ID call
console.log(fsCache.hasChanged('changed-new-unique-id', '/path/to/directory')); // true
```

## API
### `hasChanged(id: string, path: string)`

#### Parameters
- `id`: a unique string identifier for the directory or file you want to check.
- `path`: the file or directory path you want to check.

#### Returns
- `true` if the contents of the file or directory have changed since the last call with the same id.
- `false` if the contents of the file or directory have not changed since the last call with the same id.