axios.defaults.baseURL='http://geek.itheima.net'

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    token && (config.headers.Authorization = `Bearer ${token}`)
    return config
},error => {
// Do something with request error
return Promise.reject(error);
});

axios.interceptors.response.use(response => {
// Do something before response is sent
return response.data;
},error => {
// Do something with response error
return Promise.reject(error);
});