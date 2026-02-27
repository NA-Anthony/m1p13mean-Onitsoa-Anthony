// Vérifier si l'utilisateur est admin
const admin = (req, res, next) => {
    console.log('🔒 [Admin Middleware]', { 
      userRole: req.user?.role, 
      isAdmin: req.user?.role === 'admin' 
    });
    
    if (req.user && req.user.role === 'admin') {
      console.log('✅ Accès admin autorisé');
      next();
    } else {
      console.error('❌ Accès admin refusé - rôle:', req.user?.role);
      res.status(403).json({ msg: 'Accès réservé aux administrateurs' });
    }
  };
  
  // Vérifier si l'utilisateur est boutique
  const boutique = (req, res, next) => {
    if (req.user && req.user.role === 'boutique') {
      next();
    } else {
      res.status(403).json({ msg: 'Accès réservé aux boutiques' });
    }
  };
  
  // Vérifier si l'utilisateur est acheteur
  const acheteur = (req, res, next) => {
    if (req.user && req.user.role === 'acheteur') {
      next();
    } else {
      res.status(403).json({ msg: 'Accès réservé aux acheteurs' });
    }
  };
  
  module.exports = { admin, boutique, acheteur };