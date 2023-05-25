// import axios from "axios";
$('.select').click(function () {
    $('.mask').addClass('showTrue')
})

$('.mask').click(function () {
    $('.mask').removeClass('showTrue')
})
let nowDifficulty = ['elementary', 'intermediate', 'advanced']
$(`.${nowDifficulty[localStorage.getItem('nowDifficulty')]}`).addClass('nowDifficulty')
$('.elementary').click(function () {
    localStorage.setItem('nowDifficulty', 0)
    $('.nowDifficulty').removeClass('nowDifficulty')
    $(`.${nowDifficulty[localStorage.getItem('nowDifficulty')]}`).addClass('nowDifficulty')
})
$('.intermediate').click(function () {
    localStorage.setItem('nowDifficulty', 1)
    $('.nowDifficulty').removeClass('nowDifficulty')
    $(`.${nowDifficulty[localStorage.getItem('nowDifficulty')]}`).addClass('nowDifficulty')
})
$('.advanced').click(function () {
    localStorage.setItem('nowDifficulty', 2)
    $('.nowDifficulty').removeClass('nowDifficulty')
    $(`.${nowDifficulty[localStorage.getItem('nowDifficulty')]}`).addClass('nowDifficulty')
})

$('.login-button').click(function () {
    $(".verification-login").css('display', "flex");
})
$('.password-button').click(function () {
    $(".verification-login").css('display', "none");
    $(".password-login").css('display', "flex");
})
$('.verification-button').click(function () {
    $(".password-login").css('display', "none");
    $(".verification-login").css('display', "flex");
})

// $('.verification-login').click(function () {
//     $(".verification-login").css('display', "none");
// })
// $('.password-login').click(function () {
//     $(".password-login").css('display', "none");
// })

//生成验证码
let code
let phoneVal
$('.verification-code').click(function () {
    phoneVal = verification_login.id.value
    let phone = verification_login.id.value
    let regPhone = /^1[3456789]{1}\d{9}$/;
    if (phone === '') {
        $('.hint').text('请输入手机号码')
        $('.hint').css('color', 'red')
        return false;
    } else if (!regPhone.test(phone)) {
        $('.hint').text('手机号格式错误')
        $('.hint').css('color', 'red')
        return false;
    } else {
        $('.hint').text('')
        code = Math.round(Math.random() * 8999 + 1000)
        console.log(code);
    }
})

//添加session
function setSession(phone, session) {
    axios({
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        params: {
            id: phone,
            session: session
        },
        url: 'http://localhost:3000/login',
    }).then(function (res) {
        console.log(res);
    }).catch(function (error) {
        console.log(error);
    });
}


//验证码登录
$('.verification-login-button').click(function () {
    let phone = verification_login.id.value
    let regPhone = /^1[3456789]{1}\d{9}$/;
    if (phone === '') {
        $('.hint').text('请输入手机号码')
        return false;
    } else if (!regPhone.test(phone)) {
        $('.hint').text('手机号格式错误')
        return false;
    }
    if (verification_login.code.value == code && phoneVal == phone) {
        axios.get('http://localhost:3000/user', {
            params: {
                id: phone
            }
        }).then(function (res) {
            if (res.data != false) {
                let session = Math.random().toString(36).slice(2, 10)
                localStorage.setItem('session', session)
                setSession(phone, session)
                $('.login-button').css('display', 'none')
                $('.login-quit').css('display', 'flex')
                $(".verification-login").css('display', "none")
            } else {
                $(".verification-login").css('display', "none")
                $(".set-user-password").css('display', "flex")
            }
        }).catch(function (error) {
            console.log(error);
        });
    } else {
        $('.code-hint').text('验证码错误')
    }
})

//密码登录
$('.password-login-button').click(function () {
    let phone = password_login.id.value
    let regPhone = /^1[3456789]{1}\d{9}$/;
    if (phone === '') {
        $('.hint').text('请输入手机号码')
        return false;
    } else if (!regPhone.test(phone)) {
        $('.hint').text('手机号格式错误')
        return false;
    }
    axios.get('http://localhost:3000/password', {
        params: {
            id: phone,
            password: password_login.password.value
        }
    }).then(function (res) {
        if (res.data != false) {
            let session = Math.random().toString(36).slice(2, 10)
            localStorage.setItem('session', session)
            setSession(phone, session)
            $('.login-button').css('display', 'none')
            $('.login-quit').css('display', 'flex')
            $(".password-login").css('display', "none")
        } else {
            $(".password-login-hint").text('用户名或密码错误')
        }
    }).catch(function (error) {
        console.log(error);
    });
})

//退出登录
$(".login-quit").click(function () {
    localStorage.removeItem("session")
    $('.login-quit').css('display', 'none')
    $('.login-button').css('display', 'flex')
})

//判断是否已经登录
axios.get('http://localhost:3000/isLogin', {
    params: {
        session: localStorage.getItem("session") || 'null'
    }
}).then(function (res) {
    if (res.data != false) {
        $('.login-button').css('display', 'none')
        $('.login-quit').css('display', 'flex')
    }
}).catch(function (error) {
    console.log(error);
});

//设置用户名和密码
$(".setup-complete").click(function () {
    if (set.first_password.value == set.second_password.value) {
        let session = Math.random().toString(36).slice(2, 10)
        localStorage.setItem('session', session)
        axios({
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            params: {
                id: phoneVal,
                name: set.user_name.value,
                password: set.first_password.value,
                session: session
            },
            url: 'http://localhost:3000/set',
        }).then(function (res) {
            $(".set-user-password").css('display', "none")
            $('.login-button').css('display', 'none')
            $('.login-quit').css('display', 'flex')
        }).catch(function (error) {
            console.log(error);
        });
    }else{
        $(".set-hint").text('两次输入的密码不同')
    }
})