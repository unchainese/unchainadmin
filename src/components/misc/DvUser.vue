<template>

  <el-dialog v-if="obj"
             :title="title"
             :visible="visible"
             @open="doOpen"
             @close="$emit('afterClose')"
  >

    <el-form ref="form" :label-width="$store.state.formLabelWidth" status-icon :disabled="mode==='view'">

      <el-form-item label="ID">
        <el-input v-model.trim="user.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model.trim="user.email" type="email" clearable></el-input>
      </el-form-item>
      <el-form-item label="PASSWORD">
        <el-input v-model.trim="user.password" clearable></el-input>
      </el-form-item>
      <el-form-item label="AvailableKB">
        <el-input-number v-model="user.available_kb" :step="1024*1024"></el-input-number>
        <el-tag v-text="availableGB" style="margin-left: 2rem"></el-tag>
      </el-form-item>
      <el-form-item label="expired_ts">
        <el-date-picker
            v-model="user.expired"
            align="right"
            type="datetime"
            placeholder="选择日期"
            :picker-options="pickerOptions">
        </el-date-picker>

      </el-form-item>

      <el-form-item label="Sub URLS" v-if="mode==='view'">

        <el-input   type="textarea"
                    v-model="user.sub_txt"
                    rows="6"
                    disabled/>

      </el-form-item>


      <el-form-item label="">
        <el-button type="success" @click="doSubmit">Submit</el-button>
        <el-button type="danger" @click="$emit('afterClose')">Close</el-button>

      </el-form-item>
    </el-form>


  </el-dialog>

</template>

<script>

function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export default {
  props: {obj: {type: Object, require: true}, visible: Boolean, mode: String},
  name: 'DvUser',
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '1w Later',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          },
          {
            text: '1m Later',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 31);
              picker.$emit('pick', date);
            }
          },
          {
            text: '6m Later',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 31 * 6);
              picker.$emit('pick', date);
            }
          },
          {
            text: '12m Later',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 31 * 12);
              picker.$emit('pick', date);
            }
          },
          {
            text: '24m Later',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 31 * 24);
              picker.$emit('pick', date);
            }
          },
        ]
      },
      title: "User",
      sub_txt: '',
      user: {
        id: '',
        email: '',
        password: '',
        available_kb: 1024 * 1024 * 5,
        expired: new Date(),
        expired_ts: 0,
        sub_txt: '',
      },
    };
  },
  computed: {
    availableGB() {
      if (!this.user.available_kb) {
        return '0 GB'
      }
      const gb = this.user.available_kb / 1024 / 1024
      return `${gb.toFixed(2)} GB`
    },

  },
  methods: {
    async doOpen() {
      if (this.mode === 'create') {
        const now = new Date()
        now.setTime(now.getTime() + 3600 * 1000 * 24 * 7);
        this.user = {
          id: generateUUID(),
          available_kb: 1024 * 1024 * 5,
          expired: now,
          expired_ts: now.getTime() / 1000
        }
      } else if (this.mode === 'update') {
        this.user = this.obj
        this.user.expired = this.ts2Date(this.obj.expired_ts);
      } else if (this.mode === 'view') {
        this.user = this.obj
        await this.fetchUseSub()
      } else {
        this.$message.error("mode error")
      }
    },
    doSubmit() {
      if (this.mode === 'create') {
        this.userCreate()
      } else if (this.mode === 'update') {
        this.userUpdate()
      } else {
        this.$message.error("mode error")
      }
    },
    fetchUseSub() {
      const token = this.$store.getters.getToken;
      const uid = this.obj.id;
      fetch('/api/users/' + uid, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
      }).then(resp => resp.json()).then(user => {
        this.user = user
        this.user.expired = this.ts2Date(user.expired_ts);
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    userCreate() {
      const token = this.$store.getters.getToken;
      const body = this.user;
      body.expired_ts = body.expired.getTime() / 1000

      fetch('/api/users', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.user)
      }).then(() => {
        this.$message.success("success")
        this.$emit('afterClose')
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    userUpdate() {
      const token = this.$store.getters.getToken;
      const body = this.user;
      body.expired_ts = body.expired.getTime() / 1000
      fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.user)
      }).then(() => {
        this.$message.success("success")
        this.$emit('afterClose')
      }).catch(e => {
        this.$message.error(e.message)
      })
    },

  },
};
</script>
<style scoped>

</style>
