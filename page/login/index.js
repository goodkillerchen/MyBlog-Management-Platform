const form = document.querySelector('form')
let timerId
document.querySelector('.code').addEventListener('click', function(){
    let {phone, code} = serialize(form, {hash:true, empty:true})
    if(phone){
        requestVerCode(phone)
    }
    this.checked = false
    let time = 60
    if(timerId){
        return
    }
    this.text = `${time}s resend`
    timerId = setInterval(()=>{
        this.text = `${--time}s resend`
        if(time === 0){
            clearInterval(timerId)
            this.text = 'Send Code'
        }
        
    }, 1000)
    

})

const requestVerCode = (phone)=>{
    axios({
        url: "/v1_0/sms/codes",
        params:{
            moblie: phone
        }
    }).then((result) => {
        console.log(result)
    }).catch((err) => {
        console.log(err)
    });
}

document.querySelector('.login-btn').addEventListener('click', ()=>{
    const {phone, code} = serialize(form, {hash: true, empty: true})
    axios({
        url: "/v1_0/authorizations",
        method: 'POST',
        data: {
            mobile: phone,
            code
        }
    }).then((result) => {
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('refresh_token', result.data.refresh_token)
        showAlert(true, 'Login Successful!!')
        setTimeout(()=>{
            location.href = '../content/index.html'
        }, 1500)
    }).catch((err) => {
        showAlert(false, 'Login Failed!!')
    });

})