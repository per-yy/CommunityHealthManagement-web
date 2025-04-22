<script setup>
import router from '@/router';

const logout=()=>{
    router.push("/login")
}
</script>

<template>
    <header>
        <h2>社区健康管理系统</h2>
        <el-button type="primary" @click="logout()">退出登录</el-button>
    </header>
</template>

<style scoped>
header {
    height: 10vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 0 2%;
}

h2 {
    margin: 0;
    font-size: 24px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #ffffff;
    letter-spacing: 1px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.el-button {
    font-weight: 500;
    padding: 10px 25px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.el-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.el-button--primary {
    background-color: #2980b9;
    border-color: #2980b9;
}
</style>