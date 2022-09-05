const css = require('./css/template-main.css.js');

const frame = (article, login)=>{
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
                ${login.bar}
            </b>
        </p>
        <h1><a href="/">게시판</a></h1>
        ${article}
    </body>
    </html>
    `
};

exports.main = (login, list='', page='<p class="board_bottom">1</p>', search)=>{
    let article = `
    <article class="board_mg">
        <div class="board_top">
            <div class="board_id">id</div>
            <div class="board_title">제목</div>
            <div class="board_writer">작성자</div>
            <div class="board_day">날짜</div>
        </div>
        <ul class="board">
            ${list}
        </ul>
        <p class="board_button">${(login.do) ? '<a href="/write">글작성</a>' : '로그인 후 글작성 가능'}</p>
        ${page}
        <form class="board_bottom" name="search" action="/" method="get">
            <select name="type">
                <option value="titlecontent" ${(search.option === 0) ? "selected" : ""}>제목+내용</option>
                <option value="title" ${(search.option === 1) ? "selected" : ""}>제목</option>
                <option value="content" ${(search.option === 2) ? "selected" : ""}>내용</option>
                <option value="writer" ${(search.option === 3) ? "selected" : ""}>작성자</option>
            </select>
            <input type="text" name="keyword" value="${search.keyword}">
            <input type="submit" value="검색">
        </form>
    </article>
    `
    return frame(article, login);
};

exports.view = (login, id, data)=>{
    let article = `
    <article id="view_wrap" class="board_mg">
            <form class="write_wrap" name="view" method="post">
                <input type="hidden" name="id" value="${id}">
                <input type="hidden" name="title" value="${data.title}">
                <input type="hidden" name="content" value="${data.content}">
                <input type="hidden" name="writer" value="${data.writer}">
                <p class="write_balance">
                    <div class="board_id">${id}</div>
                    ${data.title}
                </p>
                <p class="write_balance">
                    작성자 : ${data.writer}
                </p>
                <div class="write_balance">
                    <p class="view_content">
                        ${data.content}
                    </p>
                </div>
                <p class="write_button">
                    <input type="submit" value="글수정" formaction="/write">
                    <input type="submit" value="글삭제" formaction="/delete_process">
                </p>
            </form>
            <form name="comment" class="comment" action="/" method="post">
                <div class="comment_balance">
                    asdf
                </div>
                <input type="text" class="comment_input" name="comment">
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

exports.write = (login, data)=>{
    let article = `
    <article id="write_wrap" class="board_mg">
        <form name="write_wrap" class="write_wrap" action="/write_process" method="post">
            <input type="hidden" name="id" value="${data.id}">
            <div class="write_balance">
                <input type="text" name="title" class="input_title" placeholder="제목을 입력하세요." value="${data.title}">
            </div>
            <div class="write_balance">
                작성자 : ${login.nickname}
            </div>
            <div class="write_balance">
                <textarea name="content" class="input_content" placeholder="내용을 입력하세요.">${data.content}</textarea>
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
    let login;
    if (user) {
        login = {
            "do" : true,
            "nickname" : user.nickname,
            "bar" : `${user.nickname} | <a href="/auth/logout_process">logout</a>`
        };
    } else {
        login = {
            "do" : false,
            "nickname" : null,
            "bar" : '<a href="/auth/login">login</a> | <a href="/auth/register">Register</a>'
        };
    }
    return login;

    // return (user) ? `${user.nickname} | <a href="/auth/logout_process">logout</a>`
    //                   : '<a href="/auth/login">login</a> | <a href="/auth/register">Register</a>';
};
