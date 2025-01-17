<template>
  <div>

    <el-row align="middle" class="toolbar" justify="start" type="flex">
      <el-col :span="4">
        <go-back-btn></go-back-btn>

      </el-col>
      <el-col :span="20" class="search-bar">



        <el-button icon="el-icon-search" size="small"
                   title="Search or Refresh"
                   type="primary"
                   @click="fetchPage">
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" border stripe>
      <el-table-column label="ip" prop="ip"  width="200"/>
      <el-table-column label="hostname" prop="hostname"  width="180"/>

      <el-table-column label="active_ts" prop="active_ts" width="160">
        <template slot-scope="scope">
          <span v-text="shortTime(scope.row.active_ts)"></span>
        </template>
      </el-table-column>

      <el-table-column label="GoRoutine" prop="goroutine" width="120">
      </el-table-column>

      <el-table-column label="version_info" prop="version_info"/>
      <el-table-column label="Sub" prop="sub_addresses"/>


      <el-table-column fixed="right" label="ACTIONS" width="120">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="small" title="VIEW" type="primary" icon="el-icon-view" @click="doView(scope.row)"></el-button>
            <el-button size="small" title="DELETE" type="danger" icon="el-icon-delete"
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

  </div>

</template>

<script>
import GoBackBtn from "@/components/misc/GoBackBtn";

export default {
  name: 'ListNodes',
  components: {GoBackBtn},
  data() {
    return {
      dfUserV: false,
      demo: [{id: 1, name: '云平台'}, {id: 2, name: '产品组'},],
      q: {page: 1, size: 15, email: ''},
      tableData: [],
      formLabelWidth: "120",
      dialogFormVisible: false,
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
    },
    doAudit() {
      this.$router.push({name: "requisitionAudit"})
    },
    doCreate() {
      this.$router.push({name: "requisitionCreate"})
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
      fetch("/api/nodes?" + new URLSearchParams(this.q))
          .then(resp => resp.json())
          .then(users => {
            this.q.page = 0
            this.q.size = users.length
            this.tableData = users
            this.total = users.length
          }).catch(console.error)
    },
    doUpdate(row) {
      this.form = row;
      this.dialogFormVisible = true
    },

    doDelete(row) {
      const token = this.$store.getters.getToken;
      fetch("/api/nodes", {
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
  }
};
</script>
<style scoped>


</style>
