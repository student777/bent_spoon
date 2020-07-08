/* NNM ( Name Number Matching ) */

var nnm = function() {
    var _this = this;
    $(document).ready(function() {
        _this.init();
        _this.onResize();
    });
}

nnm.prototype.constructor = nnm;

nnm.prototype.init = function() {
    this.m_arrString1 = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
    this.m_arrString2 = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
    this.m_arrString3 = [' ','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
    this.m_arrNumber1 = [2,4,2,3,6,5,4,4,8,2,4,1,3,6,4,3,4,4,3];
    this.m_arrNumber2 = [2,3,3,4,2,3,3,4,2,4,4,3,3,2,4,5,3,3,1,2,1];
    this.m_arrNumber3 = [0,2,4,4,2,5,5,3,5,7,9,9,7,9,9,8,4,4,6,2,4,1,3,4,3,4,4,3];

    this.m_nMatching = 2; // 맞춰볼 이름 수
    this.m_arrStringName = []; // 입력받은 이름 배열
    this.m_arrNumberName = []; // 숫자로 변환한 이름 배열
    this.m_arrJoinStringName = []; // 합친 이름 배열
    this.m_arrJoinNumberName = []; // 합친 숫자 이름 배열
    this.m_arrAveragePercent = []; // 평균 퍼센트 배열
    this.m_nAveragePercent = 0; // 평균 퍼센트
    this.m_arrAllNumber = []; // 계산된 전체 숫자가 담긴 배열
    this.m_sResult = ""; // 결과 텍스트

    this._input1 = null; // 첫번째 입력칸
    this._input2 = null; // 두번째 입력칸

    this.setEvent();
}

nnm.prototype.setEvent = function() {
    var _this = this;
    $("#btnStory").click(function() {
        _this.onCheck(_this)
    });
    $("#btnTalk").click(this.onKakaoTalk);
    $(window).resize(this.onResize);
}

nnm.prototype.onCheck = function(_this) {   
    _this._input1 = $("#inputName1"); // 첫번째 입력칸
    _this._input2 = $("#inputName2"); // 두번째 입력칸

    var sInputName1 = _this._input1.val().trim();
    var sInputName2 = _this._input2.val().trim();

    // 한쪽이라도 빈칸
    if(sInputName1.length == 0) {
        alert("본인 이름을 입력 해주세요.");
        _this._input1.focus();
        return;
    } else if (sInputName2.length == 0) {
        alert("상대방 이름을 입력 해주세요.");      
        _this._input2.focus();
        return;
    }

    // 잘못된 입력
    for(var i = 0, max = sInputName1.length ; i < max ; i ++) {
        if(sInputName1[i].charCodeAt() < 44032 || sInputName1[i].charCodeAt() > 55203) {
            alert("'" + sInputName1[i] + "'" + " 글자를 올바르게 입력 해주세요.");
            _this._input1.focus();
            return;
        }
    }
    for(var i = 0, max = sInputName2.length ; i < max ; i ++) {
        if(sInputName2[i].charCodeAt() < 44032 || sInputName2[i].charCodeAt() > 55203) {
            alert("'" + sInputName2[i] + "'" + " 글자를 올바르게 입력 해주세요.");
            _this._input2.focus();
            return;
        }
    }

    _this.reset();

    _this.nameMatching("first");
}

nnm.prototype.reset = function() {
    this.m_arrStringName = []; // 입력받은 이름 배열
    this.m_arrNumberName = []; // 숫자로 변환한 이름 배열
    this.m_arrJoinStringName = []; // 합친 이름 배열
    this.m_arrJoinNumberName = []; // 합친 숫자 이름 배열
    this.m_arrAveragePercent = []; // 평균 퍼센트 배열         
    this.m_arrAllNumber = []; // 계산된 전체 숫자가 담긴 배열
    this.m_sResult = ""; // 결과 텍스트      
}

nnm.prototype.nameMatching = function(str) {
    // 길이가 긴쪽 확인
    var bFirstLarge = true; // 첫번째 이름이 길은지 확인
    var nGap = 0; // 길이 차이
    var sPlus = ""; // 더해줄 문자

    if(this._input1.val().trim().length >= this._input2.val().trim().length) {
        nGap = this._input1.val().trim().length - this._input2.val().trim().length;
    } else {
        bFirstLarge = false;
        nGap = this._input2.val().trim().length - this._input1.val().trim().length;
    }
    for(var i = 0, max = nGap ; i < max ; i ++) {
        sPlus += "?";
    }
    // 순서 바꿔서 두번 계산
    if(str == "first") {
        this.m_arrStringName[0] = this._input1.val().trim();
        this.m_arrStringName[1] = this._input2.val().trim();
        if(bFirstLarge) {
            this.m_arrStringName[1] += sPlus;
        } else {
            this.m_arrStringName[0] += sPlus;
        }
        this.disjointing(0, this.m_arrStringName[0]);
        this.disjointing(1, this.m_arrStringName[1]);
    } else if(str == "second") {                
        this.m_arrStringName[1] = this._input1.val().trim();
        this.m_arrStringName[0] = this._input2.val().trim();
        if(bFirstLarge) {
            this.m_arrStringName[0] += sPlus;
        } else {
            this.m_arrStringName[1] += sPlus;
        }
        this.disjointing(1, this.m_arrStringName[1]);           
        this.disjointing(0, this.m_arrStringName[0]);
    }
    // 양쪽 이름 합치기
    this.nameJoin();
    // 두자리의 수가 나올때까지 반복 계산
    while(this.m_arrJoinNumberName.length > 2) {
        this.calculation();
    }
    // 평균을 구함
    if(str == "first") {
        this.m_arrAveragePercent[0] = this.m_arrJoinNumberName[0] * 10 + this.m_arrJoinNumberName[1];
        this.showResult("first");
        this.m_arrJoinStringName = [];
        this.m_arrJoinNumberName = [];
        this.m_arrAllNumber = [];
        //this.nameMatching("second"); // 두번째 입력한 이름을 첫번째로 놓고 다시 계산
    } else if(str == "second") {
        this.m_arrAveragePercent[1] = this.m_arrJoinNumberName[0] * 10 + this.m_arrJoinNumberName[1];
        this.showResult("second");              
    }
}

// 이름 분해
nnm.prototype.disjointing = function(nIndex, sName) {
    this.m_arrNumberName[nIndex] = [];
    for(var i = 0, max = sName.length ; i < max ; i++) {        
        var nCode = sName.charCodeAt(i) - 0xAC00;
        if(sName[i] == "?") {
            this.swapNumber(nIndex, i, 0, 0, 0, true);
        } else {
            this.swapNumber(nIndex, i, this.m_arrString1[parseInt(nCode / (28 * 21))], this.m_arrString2[parseInt(nCode / 28) % 21], this.m_arrString3[nCode % 28]);
        }
    }
}

// 분해된 이름 숫자로 변환
nnm.prototype.swapNumber = function(nIndex, nOrder, s1, s2, s3, bBlank) {
    var nString1 = this.m_arrNumber1[this.m_arrString1.indexOf(s1)];
    var nString2 = this.m_arrNumber2[this.m_arrString2.indexOf(s2)];
    var nString3 = this.m_arrNumber3[this.m_arrString3.indexOf(s3)];
    if(bBlank) {
        this.m_arrNumberName[nIndex][nOrder] = 0;
    } else {
        this.m_arrNumberName[nIndex][nOrder] = (nString1 + nString2 + nString3) //% 10;
    }
}

// 이름 합치기
nnm.prototype.nameJoin = function() {           
    for(var i = 0 ; i < this.m_nMatching ; i ++) {
        for(var j = 0, max = this.m_arrNumberName[i].length ; j < max ; j ++) { 
            for(var k = 0 ; k < this.m_nMatching ; k ++) {
                if(this.m_arrNumberName[k % 3][j]) {                            
                    this.m_arrJoinNumberName.push(this.m_arrNumberName[k % 3][j]);
                    this.m_arrJoinStringName.push(this.m_arrStringName[k % 3][j]);
                } else if(this.m_arrNumberName[k % 3][j] == 0) {
                    this.m_arrJoinNumberName.push(0);
                    this.m_arrJoinStringName.push("Ｘ");
                }
            }
        }
        break;
    }
    this.m_arrAllNumber.push(this.m_arrJoinNumberName);
}

// 앞 뒤 숫자 더하기
nnm.prototype.calculation = function() {    
    var arrNumber = [];
    var nJoinLength = this.m_arrJoinNumberName.length;
    var nCount = 0;             
    while(nCount < nJoinLength) {
        if(nCount + 1 < nJoinLength) {
            arrNumber[nCount] = (this.m_arrJoinNumberName[nCount] + this.m_arrJoinNumberName[nCount + 1]) % 10;
        }
        nCount++;
    }
    this.m_arrJoinNumberName = arrNumber;
    this.m_arrAllNumber.push(this.m_arrJoinNumberName);
}

nnm.prototype.showResult = function(str) {
    var sLine = "\r\n";
    var nAverage = 0;
    // 이름
    for(var i = 0, max = this.m_arrJoinStringName.toString().length-2 ; i < max ; i ++) {
        if(i == max-1) {
            this.m_sResult += "-";
        } else {
            this.m_sResult += "---";
        }
    }
    this.m_sResult +=  sLine;
    this.m_sResult += this.m_arrJoinStringName.toString().replace(/[,]/ig,"  ") + sLine;
    for(var i = 0, max = this.m_arrJoinStringName.toString().length-2 ; i < max ; i ++) {
        if(i == max-1) {
            this.m_sResult += "-";
        } else {
            this.m_sResult += "---";
        }
    }
    this.m_sResult +=  sLine;
    // 숫자
    var nSpace = "";
    for(var i = 0, max = this.m_arrAllNumber.length ; i < max ; i ++) {
        this.m_sResult += nSpace;
        nSpace += "  ";
        this.m_sResult += this.m_arrAllNumber[i].toString().replace(/[,]/ig,"   ") + sLine;
        /*
        if(i == max - 1) {
            nSpace = nSpace.replace("    ","")
            this.m_sResult += nSpace;
            this.m_sResult += "[  " + this.m_arrAllNumber[i].toString().replace(/[,]/ig,"") + "%  ]" + sLine;
        }
        */
    }
    this.m_sResult += sLine;
    
    // 최종 결과
    /*
    if(str == "second") {
        nAverage = (this.m_arrAveragePercent[0] + this.m_arrAveragePercent[1]) / 2; 
        this.m_sResult += "-----------------------------" + sLine;
        this.m_sResult += "      평균 궁합 점수     " + sLine;
        this.m_sResult += "-----------------------------" + sLine;
        if(nAverage == 0) {
            this.m_sResult += "[ " + 100 + "% ]";
        } else {
            this.m_sResult += "(" + this.m_arrAveragePercent[0] + " + " + this.m_arrAveragePercent[1] + ") / 2 = [  " + nAverage + "%  ]";
        }

        this.onKakaoStory();
    }
    */      
    
    nAverage = this.m_arrAveragePercent[0]; 
    this.m_sResult += "-----------------------------" + sLine;
    this.m_sResult += "      궁합 점수     " + sLine;
    this.m_sResult += "-----------------------------" + sLine;
    if(nAverage == 0) {
        this.m_sResult += "[ " + 100 + "% ]";
    } else {
        this.m_sResult += "[  " + nAverage + "%  ]";
    }

    this.onKakaoStory();    
}

nnm.prototype.onKakaoStory = function() {
    var str = "";

    str += "-:+:-:+:-:+:-:+:-:+:-:+:-:+:-" + "\n";
    str += "두근두근 이름숫자궁합! ♥" + "\n";
    str += "-:+:-:+:-:+:-:+:-:+:-:+:-:+:-" + "\n\n";

    str += this._input1.val() + " ♥ " +  this._input2.val() + " ";

    str += "\n\n";

    str += this.m_sResult;

    str += "" + "\n\n\n";
    str += "숫자궁합 보러가기 ↓" + "\n";
    str += document.URL; //"http://gumin.co.kr/matching";
    
    $('#resultArea').val(str);
    
    return;

    kakao.link("story").send({   
        post : str,
        appid : "http://gumin.co.kr",
        appver : "1.0",
        appname : "♥♡♥♡♥♡♥♡♥♡♥♡",
        urlinfo : JSON.stringify({
            title:"두근두근 이름숫자궁합",
            desc:"나와 상대방의 궁합은 몇퍼센트? 궁금하시다면 여기를 클릭!!", imageurl:["http://gumin.co.kr/matching/img/love.png"],
            type:"article"
        })
    });
}

nnm.prototype.onKakaoTalk = function()
{
    kakao.link("talk").send({
        msg : "\n상대방과 나의 궁합은 과연?\n두근두근 이름숫자궁합!!\n\n무료! 10초면 결과 확인 가능!\n",
        url : "http://gumin.co.kr/matching",
        appid : "http://gumin.co.kr",
        appver : "1.0",
        appname : "  두근두근 이름숫자궁합  ",
        type : "link"
    });
}

nnm.prototype.onResize = function() {
    var nMarginTop = $(".div-main-holder").css("margin-top").replace("px","");
    var nMarginBottom = $(".div-main-holder").css("margin-bottom").replace("px","");
    var nAdd = $("#MobileadAreaDiv").height();
    $(".div-main-holder").height($(document).height() - nMarginTop - nMarginBottom - nAdd + 50);
}