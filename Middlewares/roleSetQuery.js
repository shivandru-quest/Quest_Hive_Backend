const roleQuery = (req, res, next) => {
  const { role, userid } = req.query;
  if (role && userid) {
    req.role = role;
    req.userId = userid;
    next();
  } else {
    res.status(401).send("Unauthorized: Role or userId not set");
  }
};

module.exports = { roleQuery };
