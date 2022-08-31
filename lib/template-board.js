const css = require('./css/template-main.css.js');

const frame = (article, login='')=>{
    return`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>게시판</title>
        <style>
            ${css()}
        </style>
    </head>
    <body>
        <p class="auth">
            <b>
                ${login}
            </b>
        </p>
        <h1><a href="/">게시판</a></h1>
        ${article}
    </body>
    </html>
    `
};

exports.main = (login)=>{
    let article = `
    <article class="board_mg">
        <div class="board_top">
            <div class="board_id">id</div>
            <div class="board_title">제목</div>
            <div class="board_writer">작성자</div>
            <div class="board_day">날짜</div>
        </div>
        <ul class="board">
            <li>
                <div class="board_id">1515</div>
                <div class="board_title">asdf3666</div>
                <div class="board_writer">asdf3666</div>
                <div class="board_day">22-02-08</div>
            </li>
            <li>
                <div class="board_id">1515</div>
                <div class="board_title">asdf3666</div>
                <div class="board_writer">asdf3666</div>
                <div class="board_day">22-02-08</div>
            </li>
        </ul>
        <p class="board_button"><button type="button">글작성</button></p>
        <p class="board_bottom">1 2 3 4 5</p>
        <form class="board_bottom" name="search" action="/asdf" method="get">
            <select name="option">
                <option value="title&content">제목+내용</option>
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="writer">작성자</option>
            </select>
            <input type="text" name="keyword" value="">
            <input type="submit" value="검색">
        </form>
    </article>
    `
    return frame(article, login);
};

exports.view = (login)=>{
    let article = `
    <article id="write_wrap" class="board_mg">
            <div class="write_wrap">
                <div class="write_balance">
                    <div class="board_id">1515</div>
                    글 제목을 입력해주세요.
                </div>
                <div class="write_balance">
                    작성자 : admin
                </div>
                <div class="write_balance">
                    <div class="view_content">
                        글 내용
                    </div>
                </div>
            </div>
            <form name="comment" class="comment" action="/" method="post">
                <div class="comment_balance">
                    asdf
                </div>
                <input type="text" class="comment_input" id="comment">
                <input type="submit" class="comment_balance" value="댓글 작성">
            </form>
            <ul class="comment_box">
                <li class="comment_view">
                    <div class="comment_balance">asdf</div>
                    <p class="comment_content">줄바꿈이 안됨</p>
                </li>
            </ul>
        </article>
    `
    return frame(article, login);
};

exports.write = (login)=>{
    let article = `
    <article id="write_wrap" class="board_mg">
        <form name="write_wrap" class="write_wrap" accept="/" method="post">
            <div class="write_balance">
                <input type="text" id="title" class="input_title" placeholder="제목을 입력하세요.">
            </div>
            <div class="write_balance">
                작성자 : admin
            </div>
            <div class="write_balance">
                <textarea id="content" class="input_content" placeholder="내용을 입력하세요."></textarea>
            </div>
            <div class="write_button">
                <input type="submit" value="글작성">
            </div>
        </form>
    </article>
    `
    return frame(article, login);
};

exports.check_login = (user)=>{
    return (user) ? `${user.nickname} | <a href="/auth/logout_process">logout</a>`
                      : '<a href="/auth/login">login</a> | <a href="/auth/register">Register</a>';
};
