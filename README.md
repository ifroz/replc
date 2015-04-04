# `replc` [![npm version](https://badge.fury.io/js/replc.svg)](http://badge.fury.io/js/replc)

`replc` is a colorful cli console for iojs. It prefers to be installed globally and operates in your current working directory.

## Usage

```
$ npm install replc -g
$ jsh --help
```

## Usage in code

```javascript
var replc = require('replc');
replc({
  context: {
    anythingYouWouldUse: 42,
    customFunction: () => console.log('whatever');
  },
  packages: ['fs', 'lodash'],
  useDevDependencies: true
});
```

### Example usage in gulp

Note that a `setTimeout` or similar call is highly adviced to keep stdout clean.

```javascript
gulp.task('replc', function() {
  setTimeout(function() {
    replc({
      context: {
        useDevDependencies: true,
        expect: require('chai').expect
      }
    })
  });
});
```

### Config parameters
- `ctx`: context; any values in here will be accessible in your REPL.
- `preprocessor`: Transform the line before sending it to the vm. The place for coffeescript, babel, etc. Defaults to `_.identity`.
- `aliases`: require dependencies to a different name, e.g.: `{lodash: '__'}` Note that `_` contains the result of the last expression.
- `dependencies`: an optional array of package names, if you don't want to `useDependencies`.
- `useDependencies`: all `package.json` dependencies will be available, `true` by default
- `useDevDependencies`: all `package.json` devDependencies will be available, `false` by default,
- `replOptions`: additional params given to the underlying `repl`.
- `logger`: defaults to `console.log`
- `useColors`: `true` by default
- `silent`: suppress welcome message, false by default

#### Config example
```javascript
var defaultConfig = {
  context: {log: console.log},
  logger: console.log,
  path: process.cwd(),
  useDependencies: true,
  useDevDependencies: false,
  useColors: true,
  silent: false,
  dependencies: [
    'fs', 
    'lodash', 
    'moment', 
    'string', 
    'co'
  ],
  aliases: { 
    lodash: '__', 
    underscore: '__',
    string: 'S' 
  },
  replOptions: { 
    prompt: pkg.name + '#> ' 
  },
  debugMode: pkg.name === 'replc'
};
```

