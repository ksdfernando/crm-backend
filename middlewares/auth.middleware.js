exports.requireLogin = (req, res, next) => {
  const userCookie = req.cookies.user;

  if (!userCookie) {
    return res.status(401).json({ message: "Unauthorized - please login." });
  }

  try {
    req.user = JSON.parse(userCookie);
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid user session." });
  }
};
