<template>
    <i-frame :src="url"/>
    <!-- <span>{{url}}</span> -->
</template>
<script>
    import iFrame from "@/components/iFrame/index";

    export default {
        name: "Swagger",
        components: {iFrame},
        data() {
            return {
                url: process.env.VUE_APP_BASE_API + "/swagger-ui/index.html"
            };
        },
        created() {
        }
    };
</script>
