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
app.get('/', (req, res, next)=>{
    let page = (req.query.page > 1) ? (req.query.page - 1) * 20 : 0;
    let search = ` `;
    let keyword = req.query.keyword; // 쿼리문 보호하는 조치 필요.
    if (req.query.type === 'titlecontent') search = `WHERE title LIKE '%${keyword}%' OR content LIKE '%${keyword}%'`;
    else if (req.query.type === 'title') search = `WHERE title  LIKE '%${keyword}%'`;
    else if (req.query.type === 'content') search = `WHERE content LIKE '%${keyword}%'`;
    else if (req.query.type === 'writer') search = `WHERE writer LIKE '%${keyword}%'`;
    // ' or id like 'd' or id like ' <- 이딴식으로 검색하면 뚫린다. 실무에서는 쿼리문 필터 필요.
    // mysql.createconnection 에 charset을 utf8로 해도 한글검색이 안된다.
    // 비트나미인가 뭔가때문에 mysql datadir 위치가 이상한곳에 박혀있고, my.ini 파일 수정해도 클라이언트랑 db서버 cahrset이 통일이 안된다. 어쨌든 한글 검색이 안된다.

    db.query(`SELECT COUNT(*) AS count FROM board`, (err, result)=>{
        if (err) return next(err);
        if (result[0].count < 1) return res.send(template.main(template.check_login(req.user), '', '1'));
        
        let page_view = '<p class="board_bottom"> ' ;
        let count = (result[0].count / 20) + 1;
        for (var i=1; i<=count; i++){
            page_view += `<a href="/?${CheckQuery(req.query)}page=${i}">${i}</a>`
            page_view += ' ';
        }
        page_view +='</p>';

        db.query(`SELECT id, title, writer, DATE_FORMAT(day, '%y-%m-%d') AS day
        FROM board ${search} ORDER BY id DESC LIMIT ?, 20`, // search부분이 마음에 안든다. ? 치환하고 값으로 넣어주면 빈 공백때 ''까지 출력되서 에러뜬다. null로 해도 에러뜬다.
        [page], (err2, results)=>{
            if (err2) return next(err2);
            let list = '';
            for (var i=0; i<results.length; i++){
                list += `
                <li>
                    <div class="board_id">${results[i].id}</div>
                    <div class="board_title"><a href="/view?id=${results[i].id}">${results[i].title}</a></div>
                    <div class="board_writer">${results[i].writer}</div>
                    <div class="board_day">${results[i].day}</div>
                </li>
                `;
            }
            return res.send(template.main(template.check_login(req.user), list, page_view));
        });
    });
    return;
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
        res.redirect(`/view?id=${result.insertId}`);
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

const CheckQuery = (query)=>{
    return (query.type) ? `type=${query.type}&keyword=${query.keyword}&` : '';
}

//<textarea id="comment" class="comment_input" placeholder="댓글을 입력해주세요.(최대 30자)"></textarea>