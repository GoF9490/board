module.exports = ()=>{
    return`
    h1 {
        text-align: center;
    }
    
    a {
        text-decoration: none;
        color: black;
    }
    
    .auth {
        width: 800px;
        margin: 0 auto;
        margin-top: 40px;
        margin-bottom: 40px;
        text-align: right;
    }
    
    .board_top {
        width: 800px;
        margin: 0 auto;
        text-align: center;
        margin-top: 100px;
    }
    
    .board {
        width: 800px;
        margin: 0 auto;
        list-style: none;
        margin-top: 5px;
        padding: 0;
        border: 1px;
        border-style: solid;
        border-color: black;
    }
    
    .board > li {
        border: 1px;
        padding: 2px;
        border-style: solid;
        border-color: black;
    }
    
    .board_id {
        width: 80px;
        text-align: center;
        display: inline-block;
    }
    
    .board_title{
        width: 470px;
        display: inline-block;
    }
    
    .board_writer{
        width: 120px;
        text-align: center;
        display: inline-block;
    }
    
    .board_day{
        width: 100px;
        text-align: center;
        display: inline-block;
    }
    
    
    .board_button {
        width: 800px;
        margin: 0 auto;
        margin-top: 30px;
        text-align: right;
    }
    
    .board_bottom {
        width: 800px;
        margin: 0 auto;
        margin-top: 30px;
        text-align: center;
    }
    
    .board_mg {
        width: 900px;
        padding: 3px;
        margin: 0 auto;
        margin-top: 50px;
        margin-bottom: 100px;
    }
    
    .write_wrap {
        width: 800px;
        padding: 3px;
        border: 3px;
        border-style: solid;
        border-color: black;
        margin: 0 auto;
        margin-top: 50px;
        display: block;
    }
    
    .write_balance {
        width: 750px;
        margin: 0 auto;
        margin-top: 20px;
        display: block;
        font-size: 16px;
    }
    
    .write_button {
        width: 735px;
        margin: 0 auto;
        margin-top: 25px;
        display: block;
        font-size: 16px;   
        text-align: right;
    }
    
    .input_title {
        padding: 5px;
        width: 730px;
        font-size: 16px;
    }
    
    .input_content {
        padding: 5px;
        font-size: 16px;
        width: 730px;
        height: 700px;
        resize: none;
        margin-bottom: 70px;
    }
    
    .view_content {
        padding: 5px;
        font-size: 16px;
        width: 730px;
        height: 700px;
        resize: none;
        border: 2px;
        border-style: solid;
        border-color: black;
        resize: horizontal;
        margin-bottom: auto;
    }
    
    .comment {
        margin: 0 auto;
        margin-top: 100px;
        width: 800px;
        height: 50px;
        border: 2px;
        border-style: solid;
        border-color: black;
        text-align: center;
    }
    
    .comment_input {
        width: 550px;
        height: 20px;
    }
    
    .comment_balance {
        width: 100px;
        display: inline-block;
        line-height: 50px;
        resize: none;
    }
    
    .comment_box {
        margin: 0 auto;
        margin-top: 100px;
        padding: 0;
        width: 800px;
        border: 2px;
        border-style: solid;
        border-color: black;
        text-align: center;
    }
    
    .comment_view {
        border: 2px;
        border-style: solid;
        border-color: black;
        list-style: none;
    }
    
    .comment_content{
        width: 550px;
        display: inline-block;
        resize: none;
        text-align: left;
    }
    `
};