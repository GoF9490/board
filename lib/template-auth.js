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
                <p>${flash}</p>
                <input type="submit" value="Login" id="loginButton">
            </form>
            <ul>
                <li class="findText"><a href="/auth/register">회원가입</a></li>
                <li class="findText"><a>아이디 찾기</a></li> 
                <li class="findText"><a href="/auth/findPW">비밀번호 찾기</a></li>
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
            <form action="/newAcc_process" method="post">
                <p class="textContent">ID : <input type="text" class="textBox" name="id" maxlength="20" placeholder="6자 이상"></p>
                <p class="textContent">Password : <input type="password" class="textBox" name="pw" maxlength="30" placeholder="8자 이상"></p>
                <p class="textContent">Nick Name : <input type="text" class="textBox" name="nickname" maxlength="20" placeholder="3글자 이상"></p>
                <p class="textContent">Age : <input type="number" class="textBox" name="age" maxlength="3"></p>
                <p class="textContent">
                    Gender : 
                    <input type="radio" id="man" name="gender" value="man" class="radio_gender" checked="checked"><label for="man">Man</label>
                    <input type="radio" id="woman" name="gender" value="woman"><label for="woman">Woman</label>
                </p>
                <p class="textContent">
                    Question : 
                    <select name="question" class="comboBox">
                        <option value="1">질문1</option>
                        <option value="2">질문2</option>
                        <option value="3">질문3</option>
                    </select>
                </p>
                <p class="textContent">Answer : <input type="text" class="textBox" name="answer" maxlength="30" placeholder="최대 30글자"></p>
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

exports.findPW = ()=>{
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
                <form action="/findPW_process" method="post">
                    <p class="textContent">ID : <input type="text" class="textBox" name="id"></p>
                    <p class="textContent">
                        Question : 
                        <select name="question" class="comboBox">
                            <option value="1">질문1</option>
                            <option value="2">질문2</option>
                            <option value="3">질문3</option>
                        </select>
                    </p>
                    <p class="textContent">Answer : <input type="text" class="textBox" name="answer"></p>
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