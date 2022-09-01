const express = require('express');
const router = express.Router();
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const passport = require('passport');
const bcrypt = require('bcrypt');

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
        res.redirect('/');
      });
    });
});

router.get('/register', (req, res)=>{
    let fmsg = req.flash();
    let feedback = (fmsg.message) ? fmsg.message : '';
    let html = template.register(feedback);
    return res.send(html);
});

router.post('/register_process', (req, res, next)=>{
    let body = req.body;
    if (!body.email.includes('@')){
        req.flash('message', '이메일 형식을 확인해주세요.');
        return req.session.save(()=>{
            res.redirect('/auth/register');
        });
    }
    if (body.password.length < 8){
        req.flash('message', '비밀번호는 8자리 이상이여야 합니다.');
        return req.session.save(()=>{
            res.redirect('/auth/register');
        });
    }
    if (body.password !== body.password2){
        req.flash('message', '비밀번호가 일치하지 않습니다.');
        return req.session.save(()=>{
            res.redirect('/auth/register');
        });
    }
    if (body.nickname.length < 3){
        req.flash('message', '닉네임은 3글자 이상이여야 합니다.');
        return req.session.save(()=>{
            res.redirect('/auth/register');
        });
    }
    if (!body.answer){
        req.flash('message', '질문에 대한 답변을 입력해주세요.');
        return req.session.save(()=>{
            res.redirect('/auth/register');
        });
    }
    bcrypt.hash(body.password, 10, (err, hash)=>{
        if (err) return next(err);
        db.query(`INSERT INTO users 
        (email, password, nickname, question, answer, day) 
        VALUES (?, ?, ?, ?, ?, NOW())`,
        [body.email, hash, body.nickname, body.question, body.answer],
        (err1, result)=>{
            if (err1) return next(err1);
            db.query(`SELECT * FROM users WHERE email=?`,[body.email],(err2, result2)=>{
                if (err2) return next(err2);
                return req.login(result2[0], (err3)=>{
                    if (err3) return next(err3);
                    return res.redirect('/');
                });
            });
            return;
        });
    });
});

router.get('/findPW', (req, res)=>{
    let html = template.findPW();
    return res.send(html);
});

module.exports = router;