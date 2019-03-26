<template>
  <div class="Sign">
    <h3>{{msg}}</h3>
    <div><input
        type="text"
        name=""
        id=""
        v-model="userName"
        placeholder="请输入用户名"
      /> </div>
    <br />
    <div>
      <input
        type="password"
        name=""
        v-model="pwd"
        placeholder="请输入密码"
      />
    </div>
    <br />
    <div class="subBox">
      <p
        v-if="error"
        class="error"
      >*{{errMsg}}*</p>
      <button
        class="sub_btn"
        @click="linkSign"
      >登录</button>
      <button
        class="sub_btn"
        @click="checkUserAdd"
      >注册</button>
    </div>
    <br>
    <div class="userTable"><span>索引</span><span>用户名</span><span>密码</span></div>
    <div class="userTable" v-for="(item,key) in userData"><span>{{key+1}}</span><span>{{item.username}}</span><span>{{item.password}}</span></div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Sign",
  data() {
    return {
      msg: " 注册 ",
      userName: "",
      pwd: "",
      error: false,
      errMsg: '',
      userData: ''
    };
  },
  created() {
    this.addUser();
  },
  methods: {
    addUser() {
      var _this = this;
      //取数据库数据
      this.$http.get("http://localhost:3003/getUser").then(
        function(res) {
          console.log(res.data);
          _this.userData = res.data;
        },
        err => {
          console.log(err);
        }
      );
    },
    //用户注册
    checkUserAdd() {
      var _this = this;
      this.$http
        .post("api/Sign", {
          username: _this.userName,
          password: _this.pwd
        })
        .then(
          res => {
            if (res.data.status === 2) {
              _this.error = true;
              _this.addUser();
              _this.errMsg = res.data.msg;
            } else {
              _this.error = true;
              console.log(res);
              _this.errMsg = res.data.msg;
            }
          },
          err => {
            //console.log(err);
          }
        );
    },
    linkSign() {
      this.$router.push("/Login");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
p {
  margin: 0;
}
.subBox {
  position: relative;
  text-align: center;
}
.error {
  /* position: absolute;
  left: 45%; */
  color: red;
}
.userTable span{
    display: inline-block;
    width: 150px;
    line-height: 30px;
    border: 1px solid #e4e4e4;
}
/* .subBox button {
  margin-top: 30px;;
} */
</style>
