const http = require('http');
const fs = require('fs');

function subfactorial(box) {
    var ret = {};
    var name_list = box.slice();
    name_list.forEach(function (person) {
        ret[person] = pick(box, person)[0];
    });
    return ret;
    function pick(box, except) {
        var index = Math.floor(Math.random() * box.length);
        while (box[index] === except) {
            index = Math.floor(Math.random() * box.length);
        }
        return box.splice(index, 1);
    }
}
var name_list = ['v01dwalker', 'run.dong8', '_jiyoung_e', 'rightofsilence', 'jade_y1004', 'vely_yoni_official', '__hyun91', 'thisisaarroniboyy', 'ju3unoia', '3unbeom'];
var result = subfactorial(name_list);
fs.writeFileSync('result.json', JSON.stringify(result));

http.createServer((request, response) => {
    request.on('error', (err) => {
        console.error(err);
        response.statusCode = 400;
        response.end();
    });
    response.on('error', (err) => {
        console.error(err);
    });
    if (request.url === '/') {
        response.writeHead(200, { 'Content-Type': 'text' });
        var rs = fs.createReadStream('./index.html');
        rs.pipe(response);
    } else if (request.url === '/result.json') {
        response.writeHead(200, { 'Content-Type': 'json' });
        var rs = fs.createReadStream('./result.json');
        rs.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
}).listen(80);