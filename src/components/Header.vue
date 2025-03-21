<script setup>
</script>

<template>
    <header>
        <h2>社区健康管理系统</h2>
        <el-button>退出登录</el-button>
        <!-- <div class="avatar">
            <el-dropdown>
                <el-avatar :icon="Avatar" :size="50" />
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div> -->
    </header>
</template>

<style scoped>
header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgb(233, 249, 220);
}

h2 {
    line-height: 20px;
    margin-left: 1%;
}

.el-button {
    margin-right: 1%;
}
</style>