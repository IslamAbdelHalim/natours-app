exports.process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});
