var name_list = ['웅이', '화니', '영이', '발의왕', 'MS', '요니', '현조교', '용이', '푸드클리너', '뽀미'];
var result = subfactorial(name_list);
print(result);


function subfactorial(box){
    var ret = {};
    var name_list = box.slice();
    name_list.forEach(function(person){
        ret[person] = pick(box, person)[0];
    });
    return ret;
    function pick(box, except){
        var index = Math.floor(Math.random() * box.length);
        while (box[index] === except) {
            index = Math.floor(Math.random() * box.length);
        }
        return box.splice(index, 1);
    }
}

function print(result) {
    for (const name in result) {
        console.log(`${name} 가 ${result[name]} 에게 선물을 줍니다`);
    }
}