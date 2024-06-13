<template>
    <div class="login">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
            <h3 class="title">lijiacheng后台管理系统</h3>
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
                    <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
                    @keyup.enter.native="handleLogin">
                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaEnabled">
                <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%"
                    @keyup.enter.native="handleLogin">
                    <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
                </el-input>
                <div class="login-code">
                    <img :src="codeUrl" @click="getCode" class="login-code-img" />
                </div>
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
            <el-form-item style="width:100%;">
                <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
                    @click.native.prevent="handleLogin">
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                </el-button>
                <div style="float: right;" v-if="register">
                    <router-link class="link-type" :to="'/register'">立即注册</router-link>
                </div>
            </el-form-item>
        </el-form>
        <!--  底部  -->
        <!--    <div class="el-login-footer">-->
        <!--      <span>Copyright © 2018-2024 ruoyi.vip All Rights Reserved.</span>-->
        <!--    </div>-->
    </div>
</template>

<script>
    import {
        getCodeImg
    } from "@/api/login";
    import Cookies from "js-cookie";
    import {
        encrypt,
        decrypt
    } from '@/utils/jsencrypt'

    export default {
        name: "Login",
        data() {
            return {
                codeUrl: "",
                loginForm: {
                    // username: "admin",
                    // password: "admin123",
                    rememberMe: false,
                    code: "",
                    uuid: ""
                },
                loginRules: {
                    username: [{
                        required: true,
                        trigger: "blur",
                        message: "请输入您的账号"
                    }],
                    password: [{
                        required: true,
                        trigger: "blur",
                        message: "请输入您的密码"
                    }],
                    code: [{
                        required: true,
                        trigger: "change",
                        message: "请输入验证码"
                    }]
                },
                loading: false,
                // 验证码开关
                captchaEnabled: false,
                // 注册开关
                register: false,
                redirect: undefined
            };
        },
        watch: {
            $route: {
                handler: function(route) {
                    this.redirect = route.query && route.query.redirect;
                },
                immediate: true
            }
        },
        created() {
            // this.getCode();
            this.getCookie();
        },
        methods: {
            getCode() {
                getCodeImg().then(res => {
                    // 获取后台配置是否需要验证码
                    // this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
                    this.captchaEnabled = false;
                    if (this.captchaEnabled) {
                        // 写入验证码图片
                        this.codeUrl = "data:image/gif;base64," + res.img;
                        // 向注册表单中写入UUID
                        this.loginForm.uuid = res.uuid;
                    }
                });
            },

            getCookie() {
                console.log(Cookies.get("username"));
                console.log(Cookies.get("password"));
                console.log(Cookies.get("rememberMe"));
                // 从cookie中获取用户信息密码
                const username = Cookies.get("username");
                const password = Cookies.get("password");
                const rememberMe = Cookies.get('rememberMe')
                this.loginForm = {
                    username: username === undefined ? this.loginForm.username : username,
                    password: password === undefined ? this.loginForm.password : decrypt(password),
                    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
                };
            },

            // 此处是登录方法
            handleLogin() {
                // 先表单验证
                this.$refs.loginForm.validate(valid => {
                    // 表单验证成功
                    if (valid) {
                        // 按钮变成登陆中的状态
                        this.loading = true;
                        // TODO 如果登录成功则将路由定向到根目录下
                        console.log("开始跳转")
                        this.$router.push({
                            path: "/"
                        }).catch(() => {
                            console.log("跳转失败")
                        });

                        if (this.loginForm.rememberMe) {
                            // 如果是记住账号则Cookie写入账户信息
                            Cookies.set("username", this.loginForm.username, {
                                expires: 30
                            });
                            Cookies.set("password", encrypt(this.loginForm.password), {
                                expires: 30
                            });
                            Cookies.set('rememberMe', this.loginForm.rememberMe, {
                                expires: 30
                            });
                        } else {
                            // 如果是记住账号则Cookie删除账户信息
                            Cookies.remove("username");
                            Cookies.remove("password");
                            Cookies.remove('rememberMe');
                        }
                        this.$store.dispatch("Login", this.loginForm).then(() => {

                            // 如果登录成功则将路由定向到根目录下
                            this.$router.push({
                                path: this.redirect || "/"
                            }).catch(() => {});
                        }).catch(() => {
                            console.log("登录方法执行异常")
                            // 按钮恢复登陆状态
                            this.loading = false;
                            if (this.captchaEnabled) {
                                this.getCode();
                            }
                        });
                    }
                });
            }


        }
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    .login {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        background-image: url("../assets/images/login-background.jpg");
        background-size: cover;
    }

    .title {
        margin: 0px auto 30px auto;
        text-align: center;
        color: #707070;
    }

    .login-form {
        border-radius: 6px;
        background: #ffffff;
        width: 400px;
        padding: 25px 25px 5px 25px;

        .el-input {
            height: 38px;

            input {
                height: 38px;
            }
        }

        .input-icon {
            height: 39px;
            width: 14px;
            margin-left: 2px;
        }
    }

    .login-tip {
        font-size: 13px;
        text-align: center;
        color: #bfbfbf;
    }

    .login-code {
        width: 33%;
        height: 38px;
        float: right;

        img {
            cursor: pointer;
            vertical-align: middle;
        }
    }

    .el-login-footer {
        height: 40px;
        line-height: 40px;
        position: fixed;
        bottom: 0;
        width: 100%;
        text-align: center;
        color: #fff;
        font-family: Arial;
        font-size: 12px;
        letter-spacing: 1px;
    }

    .login-code-img {
        height: 38px;
    }
</style>
