<template>
  <div>
    <el-row align="middle" class="toolbar" justify="start" type="flex">
      <el-col :span="4">
        <go-back-btn></go-back-btn>
        <el-button type="primary" @click="openDfUserCreate">Create</el-button>
      </el-col>
      <el-col :span="20" class="search-bar">
        <el-date-picker
            v-model="q.created_at"
            :default-time="['00:00:00', '23:59:29']"
            end-placeholder="结束日期"
            range-separator="至"
            size="small"
            start-placeholder="开始日期"
            @change="fetchPage"
            type="daterange">
        </el-date-picker>


        <el-input v-model.trim="q.email"

                  clearable
                  placeholder="模糊搜索邮箱"
                  prefix-icon="el-icon-search"
                  size="small"
                  @change="fetchPage">
        </el-input>


        <el-button icon="el-icon-search" size="small"
                   title="Search or Refresh"
                   type="primary"
                   @click="fetchPage">
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" border stripe>
      <el-table-column fixed label="ID" prop="id" width="320"></el-table-column>
      <el-table-column label="Email" prop="email"></el-table-column>
      <el-table-column label="AvailableGB" prop="available_kb">
        <template slot-scope="scope">
          <span v-text="kbGb(scope.row.available_kb)"></span>
        </template>
      </el-table-column>
      <el-table-column label="ActiveAt" prop="active_ts">
        <template slot-scope="scope">
          <span v-text="shortTime(scope.row.active_ts)"></span>
        </template>
      </el-table-column>
      <el-table-column label="ExpiredAt" prop="expired_ts">
        <template slot-scope="scope">
          <span v-text="shortTime(scope.row.expired_ts)"></span>
        </template>
      </el-table-column>


      <el-table-column fixed="right" label="Actions" width="160">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="small" title="View" type="primary" icon="el-icon-view"
                       @click="doView(scope.row)"></el-button>
            <el-button size="small" title="Edit" type="success" icon="el-icon-edit-outline"
                       @click="doUpdate(scope.row)"></el-button>
            <el-button size="small" title="Delete" type="danger" icon="el-icon-delete"
                       @click="doDelete(scope.row)"></el-button>
          </el-button-group>
        </template>
      </el-table-column>


    </el-table>


    <el-pagination
        :current-page="q.page"
        :page-size="q.size"
        :page-sizes="[10,15, 30, 45, 60]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"

        @size-change="sizeChange"
        @current-change="pageChange">
    </el-pagination>

    <dv-user :obj="dfUserObj" :visible="dfUserV" @afterClose="dfUserV=false;fetchPage()" :mode="dfMode"/>


  </div>

</template>

<script>
import GoBackBtn from "@/components/misc/GoBackBtn";
import DvUser from "@/components/misc/DvUser.vue";

export default {
  name: 'ListUsers',
  components: { DvUser, GoBackBtn},
  data() {
    return {
      dfMode: 'create',
      dfUserV: false,
      dfUserObj: {},
      q: {page: 1, size: 15, email: ''},
      tableData: [],
      formLabelWidth: "120",
      total: 0,
      form: {},
    };
  },
  mounted() {
    this.fetchPage();
  },
  created() {
  },
  methods: {
    openDfUserCreate() {
      this.dfUserV = true
      this.dfUserObj = {
        available_kb: 1024 * 1024 * 5,
      }
    },
    doDelete(row) {
      const token = this.$store.getters.getToken;
      fetch("/api/users", {
        method: 'DELETE',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(row)
      }).then(() => {
        this.$message.success("success")
        this.fetchPage()
      }).catch(e => {
        this.$message.error(e.message)
      });
    },

    pageChange(val) {
      this.q.page = val;
      this.fetchPage()
    },
    sizeChange(val) {
      this.q.page = 1;
      this.q.size = val;
      this.fetchPage()
    },
    fetchPage() {
      fetch("/api/users?" + new URLSearchParams(this.q))
          .then(resp => resp.json())
          .then(users => {
            this.q.page = 0
            this.q.size = users.length
            this.tableData = users
            this.total = users.length
          }).catch(console.error)
    },
    doUpdate(row) {
      this.dfUserObj = row;
      this.dfMode = 'update'
      this.dfUserV = true
    },
    doView(row) {
      this.dfUserObj = row;
      this.dfMode = 'view'
      this.dfUserV = true
    },

  }
};
</script>
<style scoped>


</style>
