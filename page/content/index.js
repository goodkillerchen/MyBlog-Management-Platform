const form = document.querySelector('.sel-form')

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

let queryParams = {
    status:'',
    channel_id: '',
    page: 1,
    per_page: 2
}
let lastPage = 0
document.querySelector('.sel-btn').addEventListener('click', async function(){
    const {status, channel_id} = serialize(form, {hash: true, empty: true})
    queryParams.status = status
    queryParams.channel_id = channel_id
    console.log(queryParams)
    await setArticleLi(queryParams)
    pagination.innerHTML = `
            <li class="page-item disabled">
                <a class="page-link" data-id="pre" href="#" tabindex="-1">Previous</a>
            </li>
            <li class="page-item active">
                <a class="page-link" data-id="1" href="#">${1}</a>
            </li>
            <li class="page-item">
                <a class="page-link" data-id="2" href="#">${2}</a>
            </li>
            <li class="page-item">
                <a class="page-link" data-id="3" href="#">${3}</a>
            </li>
            <li class="page-item">
                <a class="page-link" data-id="next" href="#">Next</a>
            </li>
            `
})

const pagination = document.querySelector('.pagination')

async function setArticleLi(params){
    const res = await axios({
        url: '/v1_0/mp/articles',
        params
    })
    let trs = res.data.results
    console.log(trs)
    console.log(res.data.total_count)
    if(res.data.total_count < params.per_page){
        pagination.querySelector('[data-id="2"]').parentNode.classList.add('disabled')
        pagination.querySelector('[data-id="3"]').parentNode.classList.add('disabled')
        document.querySelector('[data-id=next]').parentNode.classList.add('disabled')
        lastPage = 1
    }
    if(res.data.total_count <= 2 * params.per_page && res.data.total_count > params.per_page){
        document.querySelector('[data-id="3"]').parentNode.classList.add('disabled')
        lastPage = 2
    }
    if(trs.length){
        const trHtml = res.data.results.map(ele=>{return `<tr>
        <td>
        <img src="${ele.cover.type === 0 ? `https://img2.baidu.com/it/u=2640406343,1419332367&amp;fm=253&amp;fmt=auto&amp;app=138&amp;f=JPEG?w=708&amp;h=500`: ele.cover.images[0]}" alt="">
        </td>
        <td>${ele.title}</td>
        <td>
        ${ele.status === 1 ? `<span class="badge text-bg-primary">Pending</span>` : `<span class="badge text-bg-success">Processed</span>`}
        </td>
        <td>
        <span>${ele.pubdate}</span>
        </td>
        <td>
        <span>${ele.read_count}</span>
        </td>
        <td>
        <span>${ele.comment_count}</span>
        </td>
        <td>
        <span>${ele.like_count}</span>
        </td>
        <td data-id="${ele.id}">
        <i class="bi bi-pencil-square edit"></i>
        <i class="bi bi-trash3 del"></i>
        </td>
    </tr>`   
        }).join('\n')
        document.querySelector('.art-list').innerHTML = trHtml
    }
    else{
        document.querySelector('[data-id=next]').parentNode.classList.add('disabled')
        lastPage = params.page - 1
    }
}
setArticleLi(queryParams);

// do with the pagination


pagination.addEventListener('click', function (e) {
    let pageNum = e.target.innerHTML
    if(/^\d+$/.test(pageNum)){
        console.log(pageNum, lastPage)
        if(pageNum < lastPage){
            console.log(lastPage)
            document.querySelector('[data-id=next]').parentNode.classList.remove('disabled')
        }
        if(pageNum === '1'){
            this.querySelector('[data-id=pre]').parentNode.classList.add('disabled')
        }
        else{
            this.querySelector('[data-id=pre]').parentNode.classList.remove('disabled')
        }
        queryParams.page = pageNum
        setArticleLi(queryParams)
        pagination.querySelector('.active').classList.remove('active')
        e.target.parentNode.classList.add('active')
    }
    else if(pageNum === 'Next'){
        let activeBtn = this.querySelector('.active a')
        console.log(activeBtn)
        if(activeBtn.innerHTML === '1'){
            this.querySelector('[data-id=pre]').parentNode.classList.remove('disabled')
        }
        if(activeBtn.dataset.id === '3'){
            this.innerHTML = `
            <li class="page-item">
                <a class="page-link" data-id="pre" href="#" tabindex="-1">Previous</a>
            </li>
            <li class="page-item">
                <a class="page-link" data-id="1" href="#">${+activeBtn.innerHTML - 1}</a>
            </li>
            <li class="page-item">
                <a class="page-link" data-id="2" href="#">${+activeBtn.innerHTML}</a>
            </li>
            <li class="page-item active">
                <a class="page-link" data-id="3" href="#">${+activeBtn.innerHTML + 1}</a>
            </li>
            <li class="page-item">
                <a class="page-link" data-id="next" href="#">Next</a>
            </li>
            `
            pageNum = +activeBtn.innerHTML + 1
        }
        else{
            const nextBtnId = +activeBtn.dataset.id + 1
            activeBtn.parentNode.classList.remove('active')
            this.querySelector(`[data-id="${nextBtnId}"]`).parentNode.classList.add('active')
            pageNum = +activeBtn.innerHTML + 1
        }
        queryParams.page = pageNum
        setArticleLi(queryParams)
    }
    else if(pageNum === 'Previous'){
        const activeBtn = this.querySelector('.active a')
        if(+activeBtn.innerHTML <= lastPage){
            document.querySelector('[data-id=next]').parentNode.classList.remove('disabled')
        }
        if(activeBtn.innerHTML === '2'){
            if(activeBtn.dataset.id !== '1'){
                const nextBtnId = +activeBtn.dataset.id - 1
                activeBtn.parentNode.classList.remove('active')
                this.querySelector(`[data-id="${nextBtnId}"]`).parentNode.classList.add('active')
                pageNum = +activeBtn.innerHTML - 1
                this.querySelector('[data-id=pre]').parentNode.classList.add('disabled')
            }
        }
        if(activeBtn.dataset.id === '1'){
            this.innerHTML = `
            <li class="page-item">
                <a class="page-link" data-id="pre" href="#" tabindex="-1">Previous</a>
            </li>
            <li class="page-item active">
                <a class="page-link" data-id="1" href="#">${+activeBtn.innerHTML - 1}</a>
            </li>
            <li class="page-item">
                <a class="page-link" data-id="2" href="#">${+activeBtn.innerHTML}</a>
            </li>
            <li class="page-item">
                <a class="page-link" data-id="3" href="#">${+activeBtn.innerHTML + 1}</a>
            </li>
            <li class="page-item">
                <a class="page-link" data-id="next" href="#">Next</a>
            </li>
            `
            pageNum = +activeBtn.innerHTML - 1
            if(pageNum === 1){
                document.querySelector('[data-id=pre]').parentNode.classList.add('disabled')
            }
        }
        else{
            const nextBtnId = +activeBtn.dataset.id - 1
            activeBtn.parentNode.classList.remove('active')
            this.querySelector(`[data-id="${nextBtnId}"]`).parentNode.classList.add('active')
            pageNum = +activeBtn.innerHTML - 1
        }
        queryParams.page = pageNum
        setArticleLi(queryParams)
    }
})

const delBlog = async (id)=>{
    console.log(2)
    try{
        const res = await axios({
        url: `/v1_0/mp/articles/${id}`,
        method: 'DELETE',
        })
        console.log(res)
        setArticleLi(queryParams)
    }catch(err){
        console.log(err)
    }
}



document.querySelector('.art-list').addEventListener('click', function(e){
    if(e.target.classList.contains('del')){
        const id = e.target.parentNode.dataset.id
        console.log(id)
        delBlog(id)
    }
    if(e.target.classList.contains('edit')){
        const artId = e.target.parentNode.dataset.id
        location.href = `../publish/index.html?id=${artId}`
    }
    
})