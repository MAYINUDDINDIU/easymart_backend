module.exports.errorHandler = (req, res, next, err) => {
  res.send(err.message);
};
