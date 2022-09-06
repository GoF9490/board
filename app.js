const port = 3005;
const title_limit = 20;
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

const passport = require('./lib/passport.js')(app);

app.use('/auth', authRouter);

// 나중에 메인페이지 따로 생긴다면 라우터로 빠질것들
app.get('/', (req, res, next)=>{
    let page = (req.query.page > 1) ? (req.query.page - 1) * title_limit : 0;

    let search = {
        'option' : 0,
        'keyword' : ''
    };

    let search_query = ` `;
    let keyword = req.query.keyword; // 쿼리문 보호하는 조치 필요.
    if (req.query.type === 'titlecontent'){
        search_query = `(title LIKE '%${keyword}%' OR content LIKE '%${keyword}%') AND`;
        search.keyword = keyword;
    }
    else if (req.query.type === 'title'){
        search_query = `title  LIKE '%${keyword}%' AND`;
        search.keyword = keyword; search.option = 1;
    }
    else if (req.query.type === 'content'){
        search_query = `content LIKE '%${keyword}%' AND`;
        search.keyword = keyword; search.option = 2;
    }
    else if (req.query.type === 'writer'){
        search_query = `writer LIKE '%${keyword}%' AND`;
        search.keyword = keyword; search.option = 3;
    }
    // ' or id like 'd' or id like ' <- 이딴식으로 검색하면 뚫린다. 실 서비스에서는 쿼리문 필터 필요.

    db.query(`SELECT id, title, writer, DATE_FORMAT(day, '%y-%m-%d') AS day
    FROM board WHERE ${search_query} deleted=0 ORDER BY id DESC`, (err, result)=>{
        if (err) return next(err);
        if (result.length < 1) return res.send(template.main(template.check_login(req.user), '', '1', search));
        
        let page_view = '<p class="board_bottom"> ' ;
        let count = Math.ceil(result.length / title_limit);
        for (var i=1; i<=count; i++){
            page_view += `<a href="/?${CheckQuery(req.query)}page=${i}">${i}</a>`
            page_view += ' ';
        }
        page_view +='</p>';

        let list = '';
        for (var i=page; i<page + title_limit; i++){
            if (!result[i]) break;
            list += `
            <li>
                <div class="board_id">${result[i].id}</div>
                <div class="board_title"><a href="/view?id=${result[i].id}">${result[i].title}</a></div>
                <div class="board_writer">${result[i].writer}</div>
                <div class="board_day">${result[i].day}</div>
            </li>
            `;
        }
        return res.send(template.main(template.check_login(req.user), list, page_view, search));
    });
    return;
});

app.get('/view', (req, res, next)=>{
    db.query('SELECT title, content, writer, deleted FROM board WHERE id=?',
    [req.query.id], (err, results)=>{
        if (err) return next(err);
        if (results[0].deleted === 1) return res.redirect('/');

        db.query(`SELECT id, writer, content, deleted FROM comment WHERE board_id=?`,
        [req.query.id], (err2, results2)=>{
            if (err2) return next(err2);

            let comment = '<ul class="comment_box">';
            for (var i=0; i<results2.length; i++){
                comment += `
                <li class="comment_view">
                    <div class="comment_balance">${(results2[i].deleted == 0) ? results2[i].writer : ''}</div>
                    <p class="comment_content">${(results2[i].deleted == 0) ? results2[i].content : '삭제된 댓글입니다.'}</p>
                    ${((results2[i].deleted != 0)) ? '' : 
                        `<a href="/comment_delete?id=${results2[i].id}&writer=${results2[i].writer}&board_id=${req.query.id}" class="comment_balance">글삭제</a>`}
                </li>
                `;
            }
            comment += '</ul>';

            return res.send(template.view(template.check_login(req.user), req.query.id, results[0], comment));
        });
    });
    return;
});

app.get('/write', (req, res)=>{
    if (!req.user) return res.redirect('/');
    let data = {
        'id' : 0,
        'title' : '',
        'content' : ''
    }
    return res.send(template.write(template.check_login(req.user), data));
});

app.post('/write', (req, res)=>{
    if (!req.user) return res.redirect('/');
    let data = {
        'id' : req.body.id,
        'title' : req.body.title,
        'content' : req.body.content
    }
    return res.send(template.write(template.check_login(req.user), data));
});

app.post('/write_process', (req, res, next)=>{
    if (req.body.title.length < 1) return res.redirect('/write');
    if (req.body.content.length < 1) return res.redirect('/write');
    if (!req.user.nickname) return next('nickname is null');

    if (req.body.id == 0){
        db.query(`INSERT INTO board (title, content, writer, day) 
        VALUES (?, ?, ?, NOW())`,
        [req.body.title, req.body.content, req.user.nickname],
        (err, result)=>{
            if (err) return next(err);
            return res.redirect(`/view?id=${result.insertId}`);
        });
    } else {
        db.query(`UPDATE board SET title=?, content=? WHERE id=?`,
        [req.body.title, req.body.content, req.body.id], (err, results)=>{
            if (err) return next(err);
            return res.redirect(`/view?id=${req.body.id}`);
        });
    } 
    return;
});

app.post('/delete_process', (req, res, next)=>{
    if (!req.user.nickname)
        return res.redirect('/');
    if (req.body.writer !== req.user.nickname)
        return res.redirect('/');

    db.query(`UPDATE board SET deleted=1 WHERE id=?`, [req.body.id], (err, results)=>{
        if (err) return next(err);
        return res.redirect('/');
    });
    return;
});

app.post('/comment_process', (req, res, next)=>{
    if (req.user.nickname !== req.body.nickname) return res.redirect('/');

    db.query(`INSERT INTO comment (board_id, writer, content, day) 
    VALUES (?, ?, ?, NOW())`, 
    [req.body.board_id, req.body.nickname, req.body.comment], 
    (err, results)=>{
        if (err) return next(err);
        return res.redirect(`/view?id=${req.body.board_id}`);
    });

    return;
});

app.get('/comment_delete', (req, res, next)=>{
    if (!req.user) return res.redirect(`/view?id=${req.query.board_id}`);
    if (req.user.nickname !== req.query.writer) return res.redirect(`/view?id=${req.query.board_id}`);

    db.query(`UPDATE comment SET deleted=1 WHERE id=?`, [req.query.id], (err, results)=>{
        if (err) return next(err);
        return res.redirect(`/view?id=${req.query.board_id}`);
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

// /6?type=post&returnURL=https%3A%2F%2Fnotabufu.tistory.com%2Fmanage%2Fposts%2F 아마도 html형식 글작성을 불러오는 형태의 url같은데
// returnURL ??