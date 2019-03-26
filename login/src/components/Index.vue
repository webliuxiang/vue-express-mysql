<template>
  <div class="main">
    <p>你好, {{userName}} 用户&emsp;{{errMsg}}</p>
    <table
      border
      class="userBox"
    >
      <tr>
        <td>索引</td>
        <td>用户名</td>
        <td>密码</td>
        <td>操作</td>
      </tr>
      <tr
        v-for="(item, index) in dataMsg"
        :key="index"
      >
        <td>{{index + 1}}</td>
        <td>{{item.username}}</td>
        <td>{{item.password}}</td>
        <td>
          <button
            class="editBtn"
            @click="editUser(item)"
          >编辑</button>
          <button
            class="cancleBtn"
            @click="deleteUser(item)"
          >删除</button></td>
      </tr>
    </table>
    <div v-if="showUserEditBox" class="editUserBox">
      <h3>编辑用户信息</h3>
      <div>
        <input
          name="username"
          type="text"
          v-model="userInfo.username"
        >
      </div>
      <br>
      <div>
        <input
          name="password"
          type="text"
          v-model="userInfo.password"
        >
      </div>
      <br>
      <div>
        <button @click="canaleUserEdit">取消</button>
        <button @click="submitUserEdit">提交</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      error: false,
      errMsg: "",
      dataMsg: "",
      userInfo: {
        id: '',
        username: '',
        password: ''
      },
      showUserEditBox: false
    };
  },
  computed: {
    userName() {
      let localData = localStorage.userName;
      if (this.$store.state.username === undefined) {
        this.$store.commit("setUserName", localData); //同步操作
      }
      return this.$store.state.userName;
    }
  },
  created() {
    this.getUser();
  },
  methods: {
    canaleUserEdit(){
      this.showUserEditBox = false;
    },
    // 更新数据
    submitUserEdit(){
      console.log(this.userInfo);
      var _this = this;
      _this.$http
        .post("api/UpdateUser", {
          id: _this.userInfo.id,
          username: _this.userInfo.username,
          password: _this.userInfo.password
        })
        .then(
          res => {
            if (res.data.status === 2) {
              _this.error = false;
              _this.getUser();
              _this.errMsg = res.data.msg;
              _this.showUserEditBox = false;
            } else {
              _this.error = true;
              console.log(res);
              _this.errMsg = res.data.msg;
            }
          },
          err => {
            console.log(err);
          }
        );
    },
    editUser(user) {
      this.showUserEditBox = true;
      this.userInfo.id = user.id;
      this.userInfo.username = user.username;
      this.userInfo.password = user.password;
    },
    getUser() {
      console.log(this);
      var _this = this;
      _this.$http.get("http://localhost:3003/getUser").then(
        function(res) {
          console.log(res.data);
          _this.dataMsg = res.data;
        },
        err => {
          console.log(err);
        }
      );
    },
    // 删除用户
    // TODO: 删除用户是要考虑是否删除的是自己的账号；如果是需要重新登陆或者请求失败
    deleteUser(user) {
      var _this = this;

      if (user.id == _this.userInfo.id) {
        _this.showUserEditBox = false;
      }
      
      this.$http
        .post("api/DeleteUser", {
          username: user.username,
          password: user.password
        })
        .then(
          res => {
            if (res.data.status === 2) {
              _this.error = false;
              _this.getUser();
              _this.errMsg = res.data.msg;
            } else {
              _this.error = true;
              console.log(res);
              _this.errMsg = res.data.msg;
            }
          },
          err => {
            console.log(err);
          }
        );
    }
  }
};
// TODO: 批量删除多条数据操作
</script>
<style scoped>
.main .userBox {
  text-align: center;
  margin: 0 auto;
  border-collapse: separate;
  border-spacing: 0px 0px;
  margin-bottom: 30px;;
}
.userBox td {
  width: 28%;
}
.userBox button {
  margin: 5px;
}
.editUserBox{
  width: 400px;
  margin: 0 auto;
  padding: 50px;
  border: 1px solid #e4e4e4;
  background: #fdfcfc;
}
.editUserBox h3 {
  margin-top: 0;
}
.editUserBox input {
  outline: none;
}
</style>
