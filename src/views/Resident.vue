<script setup>
import {
    Memo,
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
            <el-menu default-active="/resident/archives/self-info" router style="width: 10%;min-width: 150px">
                <el-sub-menu index="/resident/archives/self-info">
                    <template #title>
                        <el-icon>
                            <Memo />
                        </el-icon>
                        <span>健康档案</span>
                    </template>
                        <el-menu-item index="/resident/archives/self-info">个人信息</el-menu-item>
                        <el-menu-item index="/resident/archives/medical-record">就诊记录</el-menu-item>
                        <el-menu-item index="/resident/archives/health-report">健康报告</el-menu-item>
                </el-sub-menu>
                <el-menu-item index="/resident/consultation">
                    <el-icon>
                        <ChatSquare />
                    </el-icon>
                    <span>健康咨询</span>
                </el-menu-item>
                <el-menu-item index="/resident/appointment">
                    <el-icon>
                        <Service />
                    </el-icon>
                    <span>预约服务</span>
                </el-menu-item>
                <el-menu-item index="/resident/activity">
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

<style scoped>

</style>
