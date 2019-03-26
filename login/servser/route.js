const express = require('express');
const mysql = require('mysql');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '000',
    database: 'userinfo',
    port: 3306
});
module.exports = () => {
    const route = express.Router();
    const getHomeStr = `SELECT password,username FROM user`;
    const getCateNames = `SELECT * FROM user ORDER BY id`;
    //get homePage datas
    route.post('/login', (req, res) => {
        let mObj = {};
        for (let obj in req.body) {
            mObj = JSON.parse(obj);
        }
        let username = mObj.username;
        let password = mObj.password;
        //let password = common.md5(mObj.password + common.MD5_SUFFXIE);
        //const selectUser = "SELECT * goods WHERE username='" + username + "'" + " AND password='" + password + "'";
        const selectUser = `SELECT * FROM user WHERE username='${username}'`;
        db.query(selectUser, (err, data) => {
            if (err) {
                console.log(err);
                res.send({
                    'msg': '服务器出错',
                    'status': 0
                }).end();
            } else {
                if (data.length == 0) {
                    res.send({
                        'msg': '该用户不存在!!!',
                        'status': -1,
                        "info": req.body,
                        "ots": typeof req.body.username,
                        'name': req.body.username
                    }).end();
                } else {
                    let dataw = data[0];
                    //login sucess
                    if (dataw.password === password) {
                        //save the session 
                        // req.session['user_id'] = dataw.user_id;
                        dataw.msg = "登录成功";
                        dataw.status = 1;
                        dataw.info = req.body;
                        res.send(dataw).end();
                    } else {
                        res.send({
                            'msg': '密码不正确!!!',
                            'status': -2,
                            'psw': password,
                            "info": mObj, //req.body
                        }).end();
                    }
                }
            }
        });
    });
    // SIGN UP
    route.post('/Sign', (req, res) => {
        let mObj = {};
        for (let obj in req.body) {
            mObj = JSON.parse(obj);
        }
        let username = mObj.username;
        let password = mObj.password;
        //let password = common.md5(mObj.password + common.MD5_SUFFXIE);
        //const selectUser = "SELECT * goods WHERE username='" + username + "'" + " AND password='" + password + "'";
        const selectUser = `SELECT * FROM user WHERE username='${username}'`;
        const addUser = `INSERT INTO user (username,password) VALUES ('${username}','${password}')`;
        db.query(selectUser, (err, data) => {
            if (err) {
                console.log(err);
                res.send({
                    'msg': '服务器出错',
                    'status': 0
                }).end();
            } else {
                if (data.length == 0) {
                    db.query(addUser, (err, data) => {
                        if (err) {
                            console.log('注册失败!!!')
                        } else {
                            console.log('插入数据成功');
                            console.log(data);
                            res.send({
                                'msg': '注册成功!!!',
                                'status': 2,
                                "info": req.body,
                                "ots": typeof req.body.username,
                                'name': req.body.username
                            }).end();
                        }
                    });
                } else {
                    res.send({
                        'msg': '该用户已存在!!!',
                        'status': -2,
                        "info": req.body,
                        "ots": typeof req.body.username,
                        'name': req.body.username
                    }).end();
                }
            }
        });
    });

    // deleteUser
    route.post('/DeleteUser', (req, res) => {
        let mObj = {};
        for (let obj in req.body) {
            mObj = JSON.parse(obj);
        }
        let username = mObj.username;

        const deleteUser = `DELETE FROM user WHERE username='${username}'`;
        db.query(deleteUser, (err, data) => {
            if (err) {
                console.log(err);
                res.send({
                    'msg': '服务器出错',
                    'status': 0
                }).end();
            } else {
                console.log('删除数据成功');
                res.send({
                    'msg': '删除成功!!!',
                    'status': 2,
                    "info": req.body,
                    "ots": typeof req.body.username,
                    'name': req.body.username
                }).end();
            }
        });
    });
    // updateUser
    route.post('/UpdateUser', (req, res) => {
        let mObj = {};
        for (let obj in req.body) {
            mObj = JSON.parse(obj);
        }
        let id = mObj.id;
        let username = mObj.username;
        let password = mObj.password;

        const updateUser = `UPDATE user SET username='${username}',password='${password}'  WHERE id='${id}'`;
        db.query(updateUser, (err, data) => {
            if (err) {
                console.log(err);
                res.send({
                    'msg': '服务器出错',
                    'status': 0
                }).end();
            } else {
                console.log('更新数据成功');
                res.send({
                    'msg': '更新数据成功!!!',
                    'status': 2,
                    "info": req.body,
                    "ots": typeof req.body.username,
                    'name': req.body.username
                }).end();
            }
        });
    });
    // getUser
    route.get('/getUser', (req, res) => {
        console.log("enter back!");
        getCateNamesDatas(getCateNames, res);
    });

    function getCateNamesDatas(getCateNames, res) {
        db.query(getCateNames, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).send('database err').end();
            } else {
                if (data.length == 0) {
                    res.status(500).send('no datas').end();
                } else {
                    res.send(data);
                }
            }
        });
    };
    return route;
}