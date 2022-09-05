let products = [
  {
    id: 1,
    name: "Shirt",
  },
  { id: 2, name: "Pant" },
  { id: 3, name: "Shoe" },
];
module.exports.getAllProducts = (req, res, next) => {
  const { limit, page } = req.query;
  console.log(limit, page);
  res.json(products.slice(0, limit));
};
module.exports.insertProduct = (req, res) => {
  console.log(req.body);
  products.push(req.body);
  res.send("Inserted!");
};

module.exports.updateProduct = (req, res) => {
  // const newData = req.body;
  const { id } = req.params;
  const filter = { id: id };

  const newData = products.find((p) => p.id == id);
  newData.id = id;
  newData.name = req.body.name;
  res.send(newData);
};

module.exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  products = products.filter((p) => p.id != id);
  res.send(products);
};
