<script setup>
import {
    User,
    House,
    MapLocation,
    ChatSquare,
    Service,
    Document
} from '@element-plus/icons-vue';
import Header from '@/components/Header.vue';
</script>

<template>
    <Header></Header>
    <main>
        <div style="display: flex;">
            <el-menu default-active="/admin/user/resident" router style="width: 10%;min-width: 150px">
                <el-sub-menu index="/admin/user/resident">
                    <template #title>
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item index="/admin/user/resident">居民管理</el-menu-item>
                    <el-menu-item index="/admin/user/doctor">医生管理</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="/admin/community/hospital">
                    <template #title>
                        <el-icon>
                            <House />
                        </el-icon>
                        <span>社区管理</span>
                    </template>
                    <el-menu-item index="/admin/community/hospital">医院管理</el-menu-item>
                    <el-menu-item index="/admin/community/department">科室管理</el-menu-item>
                </el-sub-menu>
                <el-menu-item index="/admin/medical-record">
                    <el-icon>
                        <Document />
                    </el-icon>
                    <span>诊录管理</span>
                </el-menu-item>
                <el-menu-item index="/admin/consultation">
                    <el-icon>
                        <ChatSquare />
                    </el-icon>
                    <span>咨询管理</span>
                </el-menu-item>
                <el-menu-item index="/admin/appointment">
                    <el-icon>
                        <Service />
                    </el-icon>
                    <span>预约管理</span>
                </el-menu-item>
                <el-menu-item index="/admin/activity">
                    <el-icon>
                        <MapLocation />
                    </el-icon>
                    <span>活动管理</span>
                </el-menu-item>
            </el-menu>
            <router-view></router-view>
        </div>
    </main>
</template>

<style scoped></style>
