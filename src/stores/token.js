import { defineStore } from 'pinia'
import { ref } from 'vue'
/**
 * 第一个参数: 名字，唯一性
 * 第二个参数: 函数，函数内部定义状态的所有内容
 * 返回值: 函数
 * 
 */
export const useTokenStore = defineStore('token', () => {
    //定义状态的内容

    //响应式变量
    const token = ref("")
    const role=ref("")

    //定义一个函数，用来修改token
    const setToken = (newToken) => {
        token.value = newToken
    }
    const setRole=(newRole)=>{
        role.value=newRole;
    }

    //移除token的函数同时清空用户信息
    const removeToken = () => {
        token.value = '';
    }
    const removeRole=()=>{
        role.value=''
    }

    return {
        token, role,setToken, setRole,removeToken,removeRole
    }
}, {
    //持久化存储
    persist: true
})