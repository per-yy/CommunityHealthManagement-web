<script setup>
import {
    Memo, 
    Document,
    ChatSquare,
    Service,
    MapLocation
} from '@element-plus/icons-vue';
import Header from '@/components/Header.vue';
</script>

<template>
    <Header></Header>
    <main>
        <div style="display: flex;">
            <el-menu default-active="/doctor/self-info" router style="width: 10%;min-width: 150px">
                <el-menu-item index="/doctor/self-info">
                    <el-icon>
                        <Memo />
                    </el-icon>
                    <span>个人信息</span>
                </el-menu-item>
                <el-menu-item index="/doctor/diagnostic-record">
                    <el-icon>
                        <Document />
                    </el-icon>
                    <span>诊断记录</span>
                </el-menu-item>
                <el-menu-item index="/doctor/consultation">
                    <el-icon>
                        <ChatSquare />
                    </el-icon>
                    <span>健康咨询</span>
                </el-menu-item>
                <el-menu-item index="/doctor/appointment">
                    <el-icon>
                        <Service />
                    </el-icon>
                    <span>我的预约</span>
                </el-menu-item>
                <el-menu-item index="/doctor/activity">
                    <el-icon>
                        <MapLocation />
                    </el-icon>
                    <span>社区活动</span>
                </el-menu-item>

            </el-menu>
            <router-view></router-view>
        </div>
    </main>
</template>

<style scoped></style>
