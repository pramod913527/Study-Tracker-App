
module.exports = (models) => ({
  getUsers: async (req, res) => {
    const users = await models.User.find();
    res.json(users);
  },
  createUser: async (req, res) => {
    try {
      const user = await models.User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
});
