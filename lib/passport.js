const db = require('./db.js');
const bcrypt = require('bcrypt');

module.exports = function(app){
    const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    const flash = require('connect-flash');
    
    app.use(passport.initialize()); 
    app.use(passport.session()); 
    app.use(flash());
    
    passport.serializeUser(function(user, done){ 
        return done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done){ 
        return db.query('SELECT * FROM users WHERE id=?',[id],(err, result)=>{
            if (err) throw err;
            return done(null, result[0]);
        });
    });
    
    passport.use(new LocalStrategy({
            usernameField: 'email', 
            passwordField: 'password' 
        },
        function (email, password, done) {
            db.query(`SELECT * FROM users WHERE email=?`,[email], (err, result)=>{
                if (err) return done(err, false);

                if (!result[0]){
                    return done(null, false, {message: '이메일이 존재하지 않습니다.'}); 
                }

                bcrypt.compare(password, result[0].password, function(err, result2){
                    if (err) return done(err, false);
                    if (!result2) return done(null, false, {message: '패스워드가 일치하지 않습니다.'});
                    return done(null, result[0]);
                });
                return;
            });
            return;
        }
    ));
    return passport;
}
 