module.exports = tryToRequirePackageJson();

function tryToRequirePackageJson() {
  try {
    return require(process.cwd() + '/package.json');
  } catch(e) {
    return {
      name: 'unknown'
    };
  }
}