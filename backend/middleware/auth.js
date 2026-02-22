const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Récupérer le token du header Authorization (format: Bearer <token>)
  const authHeader = req.header("Authorization");
  let token = null;

  console.log('🔐 [Auth Middleware]', {
    url: req.path,
    authHeader: authHeader ? authHeader.substring(0, 20) + '...' : 'null'
  });

  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Format: Authorization: Bearer <token>
    token = authHeader.slice(7);
  } else {
    // Fallback: chercher x-auth-token pour compatibilité
    token = req.header("x-auth-token");
  }

  // Vérifier si token existe
  if (!token) {
    console.error('❌ Pas de token trouvé');
    return res.status(401).json({ msg: "Pas de token, autorisation refusée" });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    console.log('✅ Token vérifié', { userId: req.user.id, role: req.user.role });
    next();
  } catch (err) {
    console.error('❌ Token invalide:', err.message);
    res.status(401).json({ msg: "Token invalide" });
  }
};
