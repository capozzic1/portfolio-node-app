

module.exports = (req, res, next) => {
   const isLoggedIn = req.isAuthenticated();
   
   if (!isLoggedIn) {
    return res.status(401).json({ message: "Please log in."})
   }
   next()

}