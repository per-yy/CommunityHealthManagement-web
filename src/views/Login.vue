<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { loginService, registerService, sendService, changePasswordService } from '@/api/user';
import { useTokenStore } from '@/stores/token';
import { isValidEmail } from '@/utils/isValidEmail';

import router from '@/router';
//页面状态：登录、注册、修改密码
const pageState = ref('login')

//验证码持续时间 根据后端返回的时间
const duration = ref(180);
//控制发送按钮的禁用
const countDown = ref(duration.value);

const user = reactive({
    username: '',
    password: '',
    //注册和修改密码时所用的重复密码
    rePassword: '',
    email: '',
    //修改密码时所需的验证码
    verificationCode: '',
    phone: '',
    role: 'resident',
})

//用户信息
const tokenStore = useTokenStore();

const login = async () => {
    if (user.email === '' || user.password === '') {
        ElMessage.error("请输入完整信息")
    } else {
        let result = await loginService(user);
        if (result.code == 1) {
            console.log("登陆成功");
            //存储token
            tokenStore.setToken(result.data);
            //跳转页面 用户的角色名即为跳转的路径名
            router.push(user.role);
        } else {
            console.log(result.msg);
            ElMessage.error(result.msg);
        }
    }
}

//发送验证码
const send = () => {
    if (!isValidEmail(user.email)) {
        ElMessage.error("请检查邮箱是否填写正确")
    } else {
        disableButton();//禁用按钮
        ElMessage.success("发送成功,请检查邮箱")
        sendService(user.email);
        //接受返回的验证码持续的时间
        //前端定义时间，如果时间由后端决定则需要等待发送成功 看起来会卡顿
        // duration.value = result.data;
    }
}

//定时控制按钮的禁用
const disableButton = () => {
    const timer = setInterval(() => {
        countDown.value -= 1;
        if (countDown.value === 0) {
            clearInterval(timer);
            countDown.value = duration.value; // 重置倒计时
        }
    }, 1000);
}

//注册
const register = async () => {
    if (user.username === '' || user.password === '' || user.rePassword === '' || user.email === '' || user.phone === '') {
        ElMessage.error("请输入完整信息")
    } else if (user.password !== user.rePassword) {
        ElMessage.error("两次输入的密码不一致")
    } else if (!isValidEmail(user.email)) {
        ElMessage.error("请检查邮箱是否填写正确")
    } else {
        let result = await registerService(user);
        if (result.code == 1) {
            //修改页面状态为登录
            pageState.value = 'login';
            ElMessage.success("注册成功");
        } else {
            ElMessage.error(result.msg);
        }
    }
}

//修改密码
const changePassword = async () => {
    if (user.password === '' || user.rePassword === '' || user.email === '' || user.verificationCode === '') {
        ElMessage.error("请输入完整信息")
    } else if (user.password !== user.rePassword) {
        ElMessage.error("两次输入的密码不一致")
    } else {
        let result = await changePasswordService(user);
        if (result.code == 1) {
            //修改页面状态为登录
            pageState.value = 'login';
            ElMessage.success("密码修改成功");
        } else {
            ElMessage.error(result.msg);
        }
    }
}

</script>

<template>
    <div class="box-img">
    </div>
    <h1 class="title">社区健康管理系统</h1>
    <!-- 登录 -->
    <el-card class="card" v-if="pageState == 'login'">
        <h2 class="card-text">登录</h2>
        <el-form :model="user">
            <el-form-item>
                <el-input class="form-item" v-model="user.email" placeholder="邮箱" />
            </el-form-item>
            <el-form-item>
                <el-input class="form-item" v-model="user.password" placeholder="密码" show-password
                    @keydown.enter="login()" />
            </el-form-item>

            <el-form-item>
                <el-radio-group v-model="user.role">
                    <el-radio :value="'resident'">居民</el-radio>
                    <el-radio :value="'medical'">医护人员</el-radio>
                    <el-radio :value="'admin'">管理员</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item>
                <el-button class="form-item btn-affirm" type="primary" @click="login()">登录</el-button>
            </el-form-item>
        </el-form>
        <div class="other-option">
            <span @click="pageState = 'forgetPassword'">忘记密码</span>
            <span @click="pageState = 'register'">注册</span>
        </div>
    </el-card>
    <!-- 注册 -->
    <el-card class="card" v-if="pageState == 'register'">
        <h2 class="card-text">注册</h2>
        <el-form :model="user">
            <el-form-item>
                <el-input class="form-item" v-model="user.username" placeholder="用户名" />
            </el-form-item>

            <el-form-item>
                <el-input class="form-item" v-model="user.password" placeholder="密码" show-password />
            </el-form-item>

            <el-form-item>
                <el-input class="form-item" v-model="user.rePassword" placeholder="再次输入密码" show-password />
            </el-form-item>
            <el-form-item>
                <el-input class="form-item" v-model="user.email" placeholder="邮箱" type="email" />
            </el-form-item>
            <el-form-item>
                <el-input class="form-item" v-model="user.phone" placeholder="电话" type="number" />
            </el-form-item>
            <div class="box-code">
                <el-input class="input-code" v-model="user.verificationCode" placeholder="验证码" />
                <el-button class="send" type="success" :disabled="countDown !== duration" @click="send">{{ countDown <
                    duration ? `${countDown}S` : '发送验证码' }} </el-button>
            </div>

            <el-form-item>
                <el-radio-group v-model="user.role">
                    <el-radio :value="'resident'">居民</el-radio>
                    <el-radio :value="'medical'">医护人员</el-radio>
                    <el-radio :value="'admin'">管理员</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item>
                <el-button class="form-item btn-affirm" type="primary" @click="register()">注册</el-button>
            </el-form-item>
        </el-form>
        <div class="other-option">
            <span @click="pageState = 'forgetPassword'">忘记密码</span>
            <span @click="pageState = 'login'">登录</span>
        </div>
    </el-card>
    <!-- 忘记密码 -->
    <el-card class="card" v-if="pageState == 'forgetPassword'">
        <h2 class="card-text">修改密码</h2>
        <el-form :model="user">
            <el-form-item>
                <el-input class="form-item" v-model="user.email" placeholder="邮箱" />
            </el-form-item>
            <el-form-item>
                <el-input class="form-item" v-model="user.password" placeholder="新密码" show-password />
            </el-form-item>
            <el-form-item>
                <el-input class="form-item" v-model="user.rePassword" placeholder="再次输入密码" show-password />
            </el-form-item>
            <div class="box-code">
                <el-input class="input-code" v-model="user.verificationCode" placeholder="验证码" />
                <el-button class="send" type="success" :disabled="countDown !== duration" @click="send">{{ countDown <
                    duration ? `${countDown}S` : '发送验证码' }} </el-button>
            </div>

            <el-form-item>
                <el-radio-group v-model="user.role">
                    <el-radio :value="'resident'">居民</el-radio>
                    <el-radio :value="'medical'">医护人员</el-radio>
                    <el-radio :value="'admin'">管理员</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item>
                <el-button class="form-item btn-affirm" type="primary" @click="changePassword()">修改</el-button>
            </el-form-item>
        </el-form>
        <div class="other-option">
            <span @click="pageState = 'login'">登录</span>
            <span @click="pageState = 'register'">注册</span>
        </div>
    </el-card>

</template>

<style scoped>
.box-img {
    background-image: url("../../public/background.jpg");
    background-size: cover;
    height: 100vh;
    width: 750px;
}

.title {
    position: absolute;
    top: 8%;
    left: 75%;
    transform: translate(-50%, -50%);
    color: #409eff;
}

.card {
    width: 300px;
    position: absolute;
    top: 55%;
    left: 75%;
    transform: translate(-50%, -50%);
}

.card-text {
    text-align: center;
}

.form-item {
    height: 36px;
}

.btn-affirm {
    width: 260px;
    display: block;
    margin: 0 auto;
}

.other-option {
    display: flex;
    justify-content: space-between;
}

.other-option span {
    font-size: small;
    color: rgb(107, 106, 106);
    cursor: pointer;
    transition: color 0.3s;
}

.other-option span:hover {
    color: #409eff;
}

.box-code {
    display: flex;
    justify-content: space-between;
}

.send {
    width: 100px;
}

.input-code {
    width: 150px;
}
</style>
