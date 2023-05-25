// const http = require("http");
// const querystring = require("querystring");
// const db = require("../mysql/index");

import mysql from 'mysql'
import http from 'http'
import querystring from 'querystring'
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "users"
})

const server = http.createServer((req, res) => {
    // 设置响应头，允许跨域请求
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method == 'GET') {
        let path = req.url.split('?')[0]
        let query = querystring.parse(req.url.split('?')[1])
        console.log(path, query);
        if (path == '/user') {
            db.query(`select * from user where user_id=${query.id}`, (err, data) => {
                if (err) {
                    console.log("查询出错" + err.message);
                    return
                }
                if (data.length === 0) return res.end("false")
                res.end(JSON.stringify(data))
            })
        }else if (path == '/password') {
            db.query(`select * from user where user_id=${query.id}`, (err, data) => {
                if (err) {
                    console.log("查询出错" + err.message);
                    return
                }
                if (data.length === 0) return res.end("false")
                if(query.password == data[0].user_password) return res.end("true")
                else return res.end("false")
            })
        }else if (path == '/isLogin') {
            db.query(`select * from user where session="${query.session}"`, (err, data) => {
                if (err) {
                    console.log("isLogin查询出错" + err.message);
                    return res.end("false")
                }
                if (data.length === 0) return res.end("false")
                res.end(JSON.stringify(data))
            })
        }else if (path == '/getRank') {
            db.query(`select * from ranking where user_id=${query.phone} and id=${query.id}`, (err, data) => {
                if (err) {
                    console.log("getRank查询出错" + err.message);
                    return
                }
                if (data.length === 0) return res.end("false")
                res.end(JSON.stringify(data))
            })
        }else{
            return res.end('ok')
        }
    }
    if (req.method == 'POST') {
        if (req.method === "OPTIONS") {
            res.statusCode = 204;
            res.end();
        } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.setHeader("Content-Type", "application/json");
        }
        let path = req.url.split('?')[0]
        let query = querystring.parse(req.url.split('?')[1])
        console.log(query);
        if (path == "/login") {
        let sql = `UPDATE user SET session="${query.session}" WHERE user_id=${query.id};`
            db.query(sql, (err, data) => {
                if (err) return console.log("sql执行失败" + err.message);
                if (data.affectedRows !== 1) return console.log('数据更新失败');
                console.log('数据更新成功')
                res.end()
            })
        }else if(path == "/set"){
            let sql = `INSERT INTO user(user_id,user_password,user_name,session) VALUES(${query.id},${query.password},"${query.name}","${query.session}");`
            db.query(sql, (err, data) => {
                if (err) return console.log("sql执行失败" + err.message);
                if (data.affectedRows !== 1) return console.log('数据添加失败');
                console.log('数据添加成功')
                res.end()
            })
        }else if(path == "/setRank"){
            let sql = `UPDATE ranking SET data="${query.data}" WHERE id=${query.id};`
            db.query(sql, (err, data) => {
                if (err) return console.log("sql执行失败" + err.message);
                if (data.affectedRows !== 1) return console.log('数据更新失败');
                console.log('数据更新成功')
                res.end()
            })
        }else if(path == "/addRank"){
            let sql = `INSERT INTO ranking(user_id,id,data) VALUES(${query.phone},${query.id},'${query.data}');`
            db.query(sql, (err, data) => {
                if (err) return console.log("sql执行失败" + err.message);
                if (data.affectedRows !== 1) return console.log('数据添加失败');
                console.log('数据添加成功')
                res.end()
            })
        }
    }
});

server.listen(3000, () => {
    console.log("Server is running at http://127.0.0.1:3000/");
});

