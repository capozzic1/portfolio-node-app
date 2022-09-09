const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require('passport')
const LocalStrategy = require('passport-local')

module.exports = function (passport) {
  passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    
  },
  async function verify(email, password, done) {
    
    try {
      const user = await User.findOne({email: email});

      if (!user) {
        return done(null, false, { message: 'Email does not exist' })
      }

      const result = await bcrypt.compare(password, user.password)

      if (result === true) {
        return done(null, user);
      } else {

        return done(null, false, { message: 'Password is incorrect' });
      }
    } catch(e) {

    }
  }
))
/* Configure session management.
 *
 * When a login session is established, information about the user will be
 * stored in the session.  This information is supplied by the `serializeUser`
 * function, which is yielding the user ID and username.
 *
 * As the user interacts with the app, subsequent requests will be authenticated
 * by verifying the session.  The same user information that was serialized at
 * session establishment will be restored when the session is authenticated by
 * the `deserializeUser` function.
 *
 * Since every request to the app needs the user ID and username, in order to
 * fetch todo records and render the user element in the navigation bar, that
 * information is stored in the session.
 */
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});
passport.deserializeUser((id, cb) => {
  
  User.findOne({ _id: id }, (err, user) => {
    // const userInformation = {
    //   username: user.email
    // };
    console.log(user);
    cb(err, user);
  });
});

}


