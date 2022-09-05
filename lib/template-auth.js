const css = require('./css/template-auth.css.js');

exports.login = (flash = '')=>{
    return  `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <title>LoginPage</title>
            <meta charset="UTF-8">
            <style>
                ${css.login()}
            </style>
        </head>
        <body>
            <h1>Login</h1>
            <form action="/auth/login_process" method="post">
                <p>ID</p>
                <input type="text" name="email" class="loginText">
                <p>PASSWORD</p>
                <input type="password" name="password" class="loginText">
                <p style="color:red">${flash}</p>
                <input type="submit" value="Login" id="loginButton">
            </form>
            <ul>
                <li class="findText"><a href="/auth/register">회원가입</a></li>
                <li class="findText"><a href="/auth/findPw">비밀번호 재설정</a></li>
            </ul>
        </body>
        </html>
        `;
};

exports.register = (flash='')=>{
    return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <title>newAcc</title>
        <style>
            ${css.newAcc()}
        </style>
    </head>
    <body>
        <div class="contents">
            <p class="textContent" style="color:red">${flash}</p>
            <form action="/auth/register_process" method="post">
                <p class="textContent">E-mail : <input type="text" class="textBox" name="email" maxlength="30" placeholder="E-mail"></p>
                <p class="textContent">비밀번호 : <input type="password" class="textBox" name="password" maxlength="30" placeholder="8자 이상"></p>
                <p class="textContent">비밀번호 확인 : <input type="password" class="textBox" name="password2" maxlength="30" placeholder="8자 이상"></p>
                <p class="textContent">닉네임 : <input type="text" class="textBox" name="nickname" maxlength="20" placeholder="3글자 이상"></p>
                <p class="textContent">
                    질문 : 
                    <select name="question" class="comboBox">
                        <option value="1">질문1</option>
                        <option value="2">질문2</option>
                        <option value="3">질문3</option>
                    </select>
                </p>
                <p class="textContent">답변 : <input type="text" class="textBox" name="answer" maxlength="30" placeholder="최대 30글자"></p>
                <div class="button">
                    <input type="submit" value="ok">
                    <input type="button" onclick="history.back()" value="back" style="float: right;">
                </div>
            </form>
        </div>
    </body>
    </html>
    `
};

exports.findPw = (flash)=>{
    return `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>newAcc</title>
            <style>
                ${css.newAcc()}
            </style>
        </head>
        <body>
            <div class="contents">
                <form action="/auth/findPw_process" method="post">
                    <p class="textContent" style="color:red">${flash}</p>
                    <p class="textContent">Email : <input type="text" class="textBox" name="email"></p>
                    <p class="textContent">
                        질문 : 
                        <select name="question" class="comboBox">
                            <option value="1">질문1</option>
                            <option value="2">질문2</option>
                            <option value="3">질문3</option>
                        </select>
                    </p>
                    <p class="textContent">답변 : <input type="text" class="textBox" name="answer"></p>
                    <p class="textContent">비밀번호 변경 : <input type="password" class="textBox" name="password"></p>
                    <p class="textContent">비밀번호 확인 : <input type="password" class="textBox" name="password2"></p>
                    <div class="button">
                        <input type="submit" value="ok">
                        <input type="button" onclick="history.back()" value="back" style="float: right;">
                    </div>
                </form>
            </div>
        </body>
        </html>
    `
};