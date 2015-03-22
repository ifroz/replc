# `replc`

`replc` aims to be something like the `rails console`.

## Usage

Simplest: 
```
var repl = require('node-repl');
repl();
```

Configured: 
```
var config = {
  useDevDependencies: true,
  context: {
    customFunction: () => console.log('whatever');
  }
};
repl(config);
```

### Config parameters
- `context`: any objects in here will be accessible in your REPL.
- `useDependencies`: all `package.json` dependencies will be available 