<template>
    <div class="header">
        <div class="inner">
            <div class="logo">
                Promised's blog
            </div>
            <div class="nav">
                <div class="">
                    <router-link :to="{path:'home'}">{{content1}}</router-link>
                </div>
                <div class="">
                    <router-link :to="{path:'about'}">{{content2}}</router-link>
                </div>
                <div class="">
                    <router-link :to="{path:'studay'}">{{content3}}</router-link>
                </div>
                <div class="">
                    <router-link :to="{path:'contact'}">{{content4}}</router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            content1: "HOME",
            content2: "ABOUT",
            content3: "STUDAY",
            content4: "CONTACT"
        }
    }
}
</script>
<style>
/*@media (min-Width:960px) {*/

    .header {
        height: 80px;
        width: 100%;
        background-color: lightblue;
    }

    .inner {
        width: 60%;
        margin: 0 20%;
        position: relative;
    }

    .logo {
        width: 40%;
        font-size: 2rem;
        height: 80px;
        line-height: 80px;
    }

    .nav {
        width: 60%;
        position: absolute;
        top: 0;
        right: 0;
    }

    .nav div {
        float: left;
        width: 25%;
        font-size: 1.3rem;
        text-align: center;
        height: 80px;
        line-height: 80px;
    }
/*}*/

</style>
