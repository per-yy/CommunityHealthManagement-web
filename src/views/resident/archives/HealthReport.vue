<script setup>
import { ref } from 'vue';

// const consultation=ref({});

</script>

<template>
    <el-table :data="consultation" border style="width: 100%" stripe>
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="content" label="内容" />
        <el-table-column prop="createTime" label="发起时间" />
        <el-table-column prop="isReply" label="是否回复" />
    
        <el-table-column prop="replyContent" label="回复内容" />
        <el-table-column prop="doctor" label="回复医生" />
        <el-table-column prop="replyTime" label="回复时间" />
        
    </el-table>
</template>

<style scoped></style>
