const { default: axios } = require('axios');
const express = require('express');

const app = express.Router();
const con = require("./db");
const db = con.db;

app.get("/api/basestation", (req, res) => {
    const sql = `SELECT * FROM base_sta`;
    db.query(sql).then((r) => {
        res.status(200).json({
            data: r.rows
        });
    });
})

app.post("/api/lastposition", (req, res) => {
    const { stat_code } = req.body;
    // console.log(stat_code);
    const sql = `SELECT * FROM dataset WHERE stat_code = '${stat_code}' 
            AND ts = (SELECT MAX(ts) FROM dataset WHERE stat_code = '${stat_code}')`;
    db.query(sql).then((r) => {
        res.status(200).json({
            data: r.rows
        });
    });
})

app.post("/api/last20position", (req, res) => {
    const { stat_code } = req.body;
    // console.log(stat_code);
    const sql = `select a.* from (SELECT stat_code, de, dn, dh, status,
        TO_CHAR(ts,'HH24:MI') as t, TO_CHAR(ts, 'DD-MM-YYYY') as d
    FROM dataset WHERE stat_code='${stat_code}' ORDER BY ts DESC limit 20) a
    ORDER BY a.t ASC`;
    db.query(sql).then((r) => {
        res.status(200).json({
            data: r.rows
        });
    });
})

app.post("/api/reset", (req, res) => {
    const { stat_code, id } = req.body;
    // console.log(stat_code);
    const sql = `UPDATE dataset SET status=0 WHERE id=${id}`;
    db.query(sql).then((r) => {
        res.status(200).json({
            status: 'ok'
        });
    });
});

app.post("/api/register", (req, res) => {
    const { userid, username, email } = req.body;
    const sql = `INSERT INTO user_tb(userid,username,email,dt)VALUES('${userid}','${username}','${email}',now())`;
    db.query(sql).then(() => {
        console.log(sql);
        res.status(200).json({
            status: "ลงทะเบียนสำเร็จ"
        });
    });
});


app.post("/api/getalluser", (req, res) => {
    const { userid } = req.body;
    const sql = `SELECT * FROM user_tb ORDER BY username ASC`;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})

app.post("/api/getuser", (req, res) => {
    const { userid } = req.body;
    const sql = `SELECT * FROM user_tb WHERE userid='${userid}'`;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})

app.post("/api/chkadmin", (req, res) => {
    const { userid } = req.body;
    const sql = `SELECT * FROM user_tb WHERE userid='${userid}'`;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})

app.post("/api/updateuser", (req, res) => {
    const { userid, data } = req.body;
    // console.log(userid, data);
    const sql = `SELECT * FROM user_tb WHERE userid='${userid}'`;
    let d;
    db.query(sql).then(r => {
        if (r.rows.length > 0) {
            for (d in data) {
                if (data[d] !== '') {
                    let sql = `UPDATE user_tb SET ${d}='${data[d]}', dt=now() WHERE userid='${userid}'`;
                    db.query(sql)
                }
            }
        } else {
            db.query(`INSERT INTO user_tb(userid, dt)VALUES('${userid}', now())`).then(() => {
                for (d in data) {
                    if (data[d] !== '') {
                        let sql = `UPDATE user_tb SET ${d}='${data[d]}', dt=now() WHERE userid='${userid}'`;
                        db.query(sql)
                    }
                }
            })
        }
        res.status(200).json({ data: "success" })
    })
})

app.post("/api/deleteuser", (req, res) => {
    const { userid } = req.body;
    const sql = `DELETE FROM user_tb WHERE userid='${userid}'`;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})

app.post("/api/updateauth", (req, res) => {
    const { userid, user_type } = req.body;
    const sql = `UPDATE user_tb SET user_type='${user_type}' WHERE userid='${userid}'`;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})

let selectLastdata = (station) => {
    const sql = `SELECT stat_code, status FROM dataset d
                WHERE ts = (SELECT MAX(ts) FROM dataset e 
                            WHERE e.stat_code = '${station}')  
                AND d.stat_code = '${station}'`;
    db.query(sql).then((r) => {
        if (r.rows.length > 0) {
            let station = r.rows[0].stat_code;
            let status_text = r.rows[0].status;
            let ngurl = 'https://09be-2405-9800-b500-992b-e497-380e-e86d-5076.ngrok.io'

            if (status_text == 1) {
                console.log("เปิด เหลือง")
                var status_txt = "Movement is low (10-20 cm)"
                // var url = `http://rtk${station}.dyndns.org/rpidata/setRelay/?cha=3&onoff=1`
                // axios.get(url).then(x => {
                // console.log(x.data);
                // })
                axios.get(`${ngurl}/api/alert/${station}/${status_text}`)
            } else if (status_text == 2) {
                console.log("เปิด แดง")
                var status_txt = "Movement is medium (20-30 cm)"
                // var url = `http://rtk${station}.dyndns.org/rpidata/setRelay/?cha=4&onoff=1`
                // axios.get(url).then(x => {
                // console.log(x.data);
                // }) 
                axios.get(`${ngurl}/api/alert/${station}/${status_text}`)
            } else if (status_text == 3) {
                console.log("เปิด เหลือง / แดง")
                var status_txt = "Movement is high (>30 cm)"
                // var url1 = `http://rtk${station}.dyndns.org/rpidata/setRelay/?cha=3&onoff=1`
                // var url2 = `http://rtk${station}.dyndns.org/rpidata/setRelay/?cha=4&onoff=1`
                // axios.get(url1).then(x => {
                // console.log(x.data);
                // })
                // axios.get(url2).then(x => {
                // console.log(x.data);
                // })
                axios.get(`${ngurl}/api/alert/${station}/${status_text}`)
            } else {
                console.log(`RTKGNSS สถานีที่ ${station} สถานะการเคลื่อนตัวรหัส ${status_text}`);
            }

        }
    });
}

app.get('/api/status_reset/:station', (req, res) => {
    var station = req.params.station;
    console.log(station);
    res.status(200).json({ data: "Successfull" })
    // axios.get(`http://rtk${station}.dyndns.org/rpidata/setRelay/?cha=3&onoff=0`).then(x => {
    //             console.log(x.data);
    //             })
    // axios.get(`http://rtk${station}.dyndns.org/rpidata/setRelay/?cha=4&onoff=0`).then(x => {
    //             console.log(x.data);
    //             })            
})


setInterval(() => {
    // selectLastdata("01");
    // selectLastdata("02");
    // selectLastdata("03");
    // selectLastdata("04");
    // selectLastdata("05");
    // selectLastdata("06");
    // selectLastdata("07");
    // selectLastdata("08");
    // selectLastdata("09");
    // selectLastdata("10");
}, 20000)

module.exports = app;