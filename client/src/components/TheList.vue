<template>
    <div class="list">
        <router-link class="item" to="">
            <svg v-show="friend" class="friend list" @click="friend">
                <use xlink:herf="#icon-group"></use>
                <p>{{ name }}</p>
            </svg>
        </router-link>
    </div>
</template>

<script>
export default {
    name: "List",
    
}
</script>
<style lang="scss" scoped>
.list {
    display: flex;
    position: fixed;
    left: 0;
    height: 100%;
    top:50%;
    background:cadetblue;
    color: black;
    
}

</style>