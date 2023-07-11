//check whether login
const token = localStorage.getItem('token')
if(!token){
    location.href = '../login/index.html'
}

axios({
    url: '/v1_0/user/profile', 
}).then((result) => {
    document.querySelector('.user-name').innerHTML = result.data.mobile
}).catch((err) => {
    
});

document.querySelector('.quit').addEventListener('click', ()=>{
    localStorage.clear()
    location.href = '../login/index.html'
})