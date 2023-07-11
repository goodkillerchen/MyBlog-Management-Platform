// get the selected list
const sel = document.querySelector('.form-select')
sel.innerHTML = '<option value="">Select topic</option>'
axios({
    url: '/v1_0/channels',
}).then((result) => {
    const Topics = result.data.channels
    sel.innerHTML += Topics.map((ele, index)=>{
        return `<option value="${index + 1}">${ele.name}</option>`
    }).join('\n')
}).catch((err) => {
    
});

// upload cover 
const cover = document.querySelector('.img-file')
cover.addEventListener('change', async function(e){
    const file = e.target.files[0]
    const fd = new FormData()
    fd.append('image', file)
    const res = await axios({
        url: '/v1_0/upload', 
        method: 'POST',
        data: fd
    })
    console.log(res.data.url)
    document.querySelector('.place').classList.add('hide')
    document.querySelector('.rounded').src = res.data.url
    document.querySelector('.rounded').classList.add('show')
})

document.querySelector('.rounded').addEventListener('click',()=>{
    cover.click()
})

const form = document.querySelector('.blog-form')

document.querySelector('.send').addEventListener('click',async ()=>{
    const {title, channel_id, content} = serialize(form, {hash: true, empty: true})
    console.log(title, channel_id, content)
    const type = document.querySelector('.rounded').src ? 1 : 0
    const images = [type ? document.querySelector('.rounded').src : 'https://img2.baidu.com/it/u=2640406343,1419332367&amp;fm=253&amp;fmt=auto&amp;app=138&amp;f=JPEG?w=708&amp;h=500https://img2.baidu.com/it/u=2640406343,1419332367&amp;fm=253&amp;fmt=auto&amp;app=138&amp;f=JPEG?w=708&amp;h=500']
    const cover={
        type, images
    }
    console.log(cover)
    try{
        const res = await axios({
            url: "/v1_0/mp/articles",
            method: "POST",
            data:{
            title, channel_id, content, cover}
        })
        if(res.message === "OK"){
            showAlert(true, "Publish successful!!")
        }
    }
    catch(err){
        showAlert(false, "Publish failed!!")
    }
})


