const port = 3005;
const express = require('express'); // 프레임워크
const app = express();
const bodyParser = require('body-parser'); // post값 body객체로 만들어줌
const compression = require('compression'); // 압축기능
const helmet = require('helmet'); // 보안기능
const cookieParser = require('cookie-parser'); // 쿠키값 읽고 
const session = require('express-session'); // 세션
const fileStore = require('session-file-store')(session); // 세션 파일로 저장

const db = require('./lib/db.js');
const template = require('./lib/template-board');
const authRouter = require('./route/authRouter.js');

app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.use(cookieParser());

app.use(session({
    HttpOnly: true,
    secret: 'd1fe8s8d1f5dsfsd8',
    resave: false,
    saveUninitialized: true,
    store: new fileStore()
}));

const passport = require('./lib/passport.js')(app); // 패스포트 아직 안쓴다

app.use('/auth', authRouter);

// 나중에 메인페이지 따로 생긴다면 라우터로 빠질것들
app.get('/', (req, res)=>{
    return res.send(template.main(template.check_login(req.user)));
});

app.get('/view', (req, res)=>{
    return res.send(template.view(template.check_login(req.user)));
});

app.get('/write', (req, res)=>{
    if (!req.user) return res.redirect('/');
    return res.send(template.write(template.check_login(req.user)));
});

app.post('/write_process', (req, res, next)=>{
    if (req.body.title.length < 1) return res.redirect('/write');
    if (req.body.content.length < 1) return res.redirect('/write');
    if (!req.user.nickname) return next('nickname is null');
    db.query(`INSERT INTO board 
    (title, content, writer, day) 
    VALUES (?, ?, ?, NOW())`,
    [req.body.title, req.body.content, req.user.nickname],
    (err, result)=>{
        if (err) return next(err);
        res.redirect(`/view/?id=${result.insertId}`);
    });
    return;
});
// 여기까지

app.use((err, req, res, next)=>{
    console.error(err.stack);
    return res.status(500).send('에러');
});

app.listen(port, ()=>{
    console.log('listen '+port);
});

//<textarea id="comment" class="comment_input" placeholder="댓글을 입력해주세요.(최대 30자)"></textarea>