const showAlert = (isSuccess, msg)=>{
    const alert = document.querySelector('.alert')
    if(isSuccess){
        alert.classList.add('alert-success')
        alert.classList.remove('alert-danger')
        alert.classList.add('show')
        alert.innerHTML = msg
    }
    else{
        alert.classList.add('alert-danger')
        alert.classList.remove('alert-success')
        alert.classList.add('show')
        alert.innerHTML = msg
    }
    setTimeout(()=>{
        alert.classList.remove('alert-danger')
        alert.classList.remove('alert-success')
        alert.classList.remove('show')
        alert.innerHTML = ''
    }, 2000)
}