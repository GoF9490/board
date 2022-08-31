const express = require('express');
const router = express.Router();
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const passport = require('passport');

const db = require('../lib/db.js');
const template = require('../lib/template-auth.js')

router.get('/login', (req, res)=>{
    let fmsg = req.flash();
    let feedback = (fmsg.message) ? fmsg.message : '';
    let html = template.login(feedback);
    return res.send(html);
});

router.post('/login_process', (req, res, next)=>{
    passport.authenticate('local', (err, user, info)=>{
        if (err) return next(err);
        if (!user){
            req.flash('message', info.message);
            return req.session.save(()=>{
                return res.redirect('/auth/login');
            });
        }
        req.logIn(user, (err)=>{
            if (err) return next(err);
            return req.session.save(()=>{
                return res.redirect('/');
            });
        });
    })(req, res, next);
});

router.get('/logout_process', (req, res)=>{
    return req.logout(()=>{
      req.session.save(()=>{
        res.status(302).redirect('/');
      });
    });
});

router.get('/register', (req, res)=>{
    let fmsg = req.flash();
    let feedback = (fmsg.message) ? fmsg.message : '';
    let html = template.register(feedback);
    return res.send(html);
});

router.get('/findPW', (req, res)=>{
    let html = template.findPW();
    return res.send(html);
});

module.exports = router;