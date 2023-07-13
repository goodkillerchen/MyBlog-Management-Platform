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

const getFormData = ()=>{
    const {title, channel_id, content} = serialize(form, {hash: true, empty: true})
    console.log(title, channel_id, content)
    const type = document.querySelector('.rounded').src ? 1 : 0
    const images = [type ? document.querySelector('.rounded').src : 'https://img2.baidu.com/it/u=2640406343,1419332367&amp;fm=253&amp;fmt=auto&amp;app=138&amp;f=JPEG?w=708&amp;h=500https://img2.baidu.com/it/u=2640406343,1419332367&amp;fm=253&amp;fmt=auto&amp;app=138&amp;f=JPEG?w=708&amp;h=500']
    const cover={
        type, images
    }
    return {
        title, channel_id, content, cover}
}

document.querySelector('.send').addEventListener('click',async (e)=>{
    if(e.target.innerHTML !== 'Post'){
        return;
    }
   
    try{
        const res = await axios({
            url: "/v1_0/mp/articles",
            method: "POST",
            data: getFormData()
            
        })
        if(res.message === "OK"){
            showAlert(true, "Publish successful!!")
        }
    }
    catch(err){
        showAlert(false, "Publish failed!!")
    }
})

const cardTitle = document.querySelector('.card-title')
const change2Edit = ()=>{
    cardTitle.innerHTML = 'Edit Blog'
    const subBtn = document.querySelector('.send')
    subBtn.innerHTML = 'Edit'
}

const displayEditInfo = async (id)=>{
    console.log(id)
    const req = await axios({
        url: `/v1_0/mp/articles/${id}`,
    })
    let blogInfo = req.data
    console.log(blogInfo)
    let {title, channel_id, content, cover} = blogInfo
    document.querySelector('[name=title]').value = title
    document.querySelector('.rounded').src = cover.images[0]
    document.querySelector('.rounded').classList.remove('hide')
    document.querySelector('.place').classList.add('hide')
    document.querySelector('.rounded').classList.add('show')
    document.querySelector('[name=channel_id]').value = channel_id
    editor.setHtml(content)

}

;(function eidtMode(){
    let params = new URLSearchParams(location.search)
    const id = params.get('id')
    if(id){
        change2Edit()
        displayEditInfo(id)
        document.querySelector('.send').addEventListener('click', async (e)=>{
            if(e.target.innerHTML !== 'Edit'){
                return;
            }
            console.log(getFormData())
            try{
                const req = await axios({
                    url:`/v1_0/mp/articles/${id}`,
                    method: 'PUT',
                    data: getFormData()
                })
                console.log(req)
                showAlert(true, 'Edit successful')
            }
            catch(err){
                showAlert(false, 'Edit failed')
            }
        })
    }
})()



