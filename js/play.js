let img = []
for (let i = 0; i < 39; i++) {
    let radomNum = Math.floor(Math.random() * img.length)
    img.splice(radomNum, 0, i)
}
let difficulty = [[400, 400, 100, 8], [450, 540, 90, 15], [480, 560, 80, 21]]
let nowDifficult = localStorage.getItem('nowDifficulty') || 0
if (window.outerWidth > window.outerHeight) {
    $('.play-box').css('width', difficulty[nowDifficult][1] + 'rem')
    $('.play-box').css('max-width', difficulty[nowDifficult][1] + 'px')
    $('.play-box').css('height', difficulty[nowDifficult][0] + 'rem')
    $('.play-box').css('max-height', difficulty[nowDifficult][0] + 'px')
} else {
    $('.play-box').css('width', difficulty[nowDifficult][0] + 'rem')
    $('.play-box').css('max-width', difficulty[nowDifficult][0] + 'px')
    $('.play-box').css('height', difficulty[nowDifficult][1] + 'rem')
    $('.play-box').css('max-height', difficulty[nowDifficult][1] + 'px')
}
let newImg = []
let grade = 0
let m = '00'
let s = '00'
let activeDiv = []
let easy = localStorage.getItem('easy')?.split(',') || []
let middle = localStorage.getItem('middle')?.split(',') || []
let difficult = localStorage.getItem('difficult')?.split(',') || []
let phone

$(".grade").text(grade)
img.slice(0, difficulty[nowDifficult][3]).map((item, index) => {
    for (let i = 0; i < 2; i++) {
        let content = (`
            <div class="content-box ${index}" style="max-width:${difficulty[nowDifficult][2]}px;max-height:${difficulty[nowDifficult][2]}px;width: ${difficulty[nowDifficult][2]}rem;height:${difficulty[nowDifficult][2]}rem;">
                <div class="cover"></div>
                <div class="back" style="background-image: url(../images/${item}.jpeg);"></div>
            </div>`)
        let radomNum = Math.floor(Math.random() * newImg.length)
        newImg.splice(radomNum, 0, content)
    }
})
newImg.map(item => $(".play-box").append(item))
let steps = 0
$(".steps").text(steps)
let addClassName = function () {
    steps++
    $(".steps").text(steps)
    $(this).addClass('active')
    $('.active').off('click')
    console.log($(this).attr("class").split(' '));
    activeDiv.push($(this).attr("class").split(' ')[1])
    judge()
}
$(".content-box").click(addClassName)
let boxNum = $(".content-box").length

function setMysqlRank(nowDifficult, data) {
    axios.get('http://localhost:3000/isLogin', {
        params: {
            session: localStorage.getItem("session") || 'null'
        }
    }).then(function (res) {
        phone = res.data[0].user_id
        axios.get('http://localhost:3000/getRank', {
            params: {
                phone: phone,
                id: nowDifficult
            }
        }).then(function (res) {
            if (res.data != false) {
                axios({
                    method: 'POST',
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    params: {
                        phone: phone,
                        id: nowDifficult,
                        data: JSON.stringify(data)
                    },
                    url: 'http://localhost:3000/setRank',
                })
            } else {
                axios({
                    method: 'POST',
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    params: {
                        phone: phone,
                        id: nowDifficult,
                        data: JSON.stringify(data)
                    },
                    url: 'http://localhost:3000/addRank',
                })
            }
        }).catch(function (error) {
            console.log(error);
        });
    }).catch(function (error) {
        console.log(error);
    });
}
function judge() {
    if (activeDiv.length == 2) {
        $(".content-box").off("click")
        setTimeout(function () {
            if (activeDiv[0] != activeDiv[1]) {
                $(`.${activeDiv[0]}`).removeClass('active')
                $(`.${activeDiv[1]}`).removeClass('active')
                activeDiv = []
            } else {
                $(".active").removeClass('content-box')
                $(".active").css('opacity', 0);
                activeDiv = []
                grade += 100
                $(".grade").text(grade)
            }
            $(".content-box").click(addClassName)
            boxNum = $(".content-box").length
            if (boxNum == 0) {
                clearInterval(nowTime)
                let maxTime = difficulty[nowDifficult][3] * 8
                let useTime = m * 60 + s
                $(".finally-grade-box").css('display', 'flex');
                $(".basics-grade").text(grade)
                if (maxTime > useTime) {
                    let timeGrade = (maxTime - useTime) * 10
                    grade += timeGrade
                    $(".time-grade").text(timeGrade)
                }
                if (difficulty[nowDifficult][3] * 6 > steps) {
                    let stepsGrade = (difficulty[nowDifficult][3] * 6 - steps) * 10
                    grade += stepsGrade
                    $(".steps-grade").text(stepsGrade)
                }
                let rankData = []
                let difficultName = ["easy", "middle", "difficult"]
                if (localStorage.getItem('session')) {
                    axios.get('http://localhost:3000/isLogin', {
                        params: {
                            session: localStorage.getItem("session") || 'null'
                        }
                    }).then(function (res) {
                        phone = res.data[0].user_id
                        axios.get('http://localhost:3000/getRank', {
                            params: {
                                phone: phone,
                                id: nowDifficult
                            }
                        }).then(function (res) {
                            if (res.data != false) {
                                rankData = JSON.parse(res.data[0].data) || []
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }).catch(function (error) {
                        console.log(error);
                    });
                } else {
                    rankData = localStorage.getItem(difficultName[nowDifficult])?.split(',') || []
                }
                rankData.push(grade)
                rankData.sort(function (a, b) { return b - a })
                if (rankData.length > 10) {
                    rankData.pop()
                }
                if (localStorage.getItem('session')) {
                    setMysqlRank(nowDifficult, rankData)
                } else {
                    localStorage.setItem(difficultName[nowDifficult], rankData)
                }
                $(".end-grade").text(grade)
                $(".grade").text(grade)
            }
        }, 1000)
    }
}

let time = m + ':' + s
$(".time").text(time)
function myGrade() {
    if (s < 59) {
        s = s++ < 9 ? '0' + s++ : s++
    } else {
        s = '00',
            m = m++ < 9 ? '0' + m++ : m++
    }
    time = m + ':' + s
    $(".time").text(time)
}
$(".stop").click(function () {
    $('.mask').addClass('showTrue')
    clearInterval(nowTime)
})
$('.continue').click(function () {
    $('.mask').removeClass('showTrue')
    nowTime = setInterval(function () { myGrade() }, 1000)
})
$('.anew').click(function () {
    location.reload()
})
$('.return').click(function () {
    history.go(-1)
})
var nowTime = setInterval(function () { myGrade() }, 1000)
$('.change').click(function () {
    $('.difficulty').addClass('showDifficulty')
})
$('.difficulty').click(function () {
    $('.difficulty').removeClass('showDifficulty')
})
let nowDifficulty = ['elementary', 'intermediate', 'advanced']
$(`.${nowDifficulty[localStorage.getItem('nowDifficulty')]}`).addClass('nowDifficulty')
$('.elementary').click(function () {
    localStorage.setItem('nowDifficulty', 0)
    $('.nowDifficulty').removeClass('nowDifficulty')
    $('.elementary').addClass('nowDifficulty')
    location.reload()
})
$('.intermediate').click(function () {
    localStorage.setItem('nowDifficulty', 1)
    $('.nowDifficulty').removeClass('nowDifficulty')
    $('.intermediate').addClass('nowDifficulty')
    location.reload()
})
$('.advanced').click(function () {
    localStorage.setItem('nowDifficulty', 2)
    $('.nowDifficulty').removeClass('nowDifficulty')
    $('.advanced').addClass('nowDifficulty')
    location.reload()
})