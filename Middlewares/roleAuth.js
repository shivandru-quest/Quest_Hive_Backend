const authorizedRole = (permittedRole) => {
  return (req, res, next) => {
    const role = req.role;
    if (!role) {
      return res.status(401).send("Unauthorized: Role or userId not set");
    }
    if (permittedRole.includes(role)) {
      next();
    } else {
      res.status(403).send(`Forbidden: Access denied for role ${role}`);
    }
  };
};

module.exports = { authorizedRole };
