# `replc`

`replc` aims to be something like the `rails console`, for iojs. It operates in your current working directory.

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

### Config parameters
- `context`: any objects in here will be accessible in your REPL.
- `aliases`: require dependencies to a different name, e.g.: `{lodash: '__'}` Note that `_` contains the result of the last expression.
- `dependencies`: an optional array of package names, if you don't want to `useDependencies`.
- `useDependencies`: all `package.json` dependencies will be available, `true` by default
- `useDevDependencies`: all `package.json` devDependencies will be available, `false` by default,
- `replOptions`: additional params given to the underlying `repl`.
- `logger`: defaults to `console.log`
- `useColors`: `true` by default
- `silent`: suppress welcome message, false by default

An example config would look like this:
```javascript
var defaultConfig = {
  context: {log: console.log},
  logger: console.log,
  path: process.cwd(),
  useDependencies: true,
  useDevDependencies: pkg.name === 'replc',
  useColors: true,
  silent: false,
  dependencies: ['fs', 'lodash', 'moment', 'string', 'co'],
  aliases: { lodash: '__', underscore: '__', string: 'S' },
  // _ has special value in the node repl.
  replOptions: { prompt: pkg.name + '#> ' },
  debugMode: pkg.name === 'replc'
};
```