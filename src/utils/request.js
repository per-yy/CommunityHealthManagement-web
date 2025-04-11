//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
import { useTokenStore } from '../stores/token';
import { ElMessage } from 'element-plus';
import router from '@/router'
//定义一个变量,记录公共的前缀  ,  baseURL
// const baseURL = 'http://localhost:8080';
const baseURL = '/api';
const instance = axios.create({ baseURL })
//添加请求拦截器
instance.interceptors.request.use(
    (config) => {
        //请求前的回调
        //添加token
        const tokenStore = useTokenStore();
        if (tokenStore.token) {
            config.headers.token = tokenStore.token
        }
        return config;
    }
)

//添加响应拦截器
instance.interceptors.response.use(
    result => {
        return result.data;
    },
    err => {
        //判断是否登录或登录是否过期、是否为本角色的访问
        if (err.response.status === 401) {
            const tokenStore = useTokenStore();
            if (tokenStore.token) {
                ElMessage.error('登录过期')
            } else {
                ElMessage.error('请先登录')
            }
            router.push('/login')
        } else if (err.response.status === 403) {
            ElMessage.error("非法访问")
            router.push("/login")
        } else {
            ElMessage.error('服务异常')
        }
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;
