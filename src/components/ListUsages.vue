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
      <el-table-column label="uid" prop="uid"  />
      <el-table-column label="created_date" prop="created_date" />

      <el-table-column label="category" prop="category" />

      <el-table-column label="kb" prop="kb" width="120">
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
  name: 'ListUsages',
  components: {GoBackBtn},
  data() {
    return {
      dfUserV: false,
      q: {page: 1, size: 150, email: ''},
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
      fetch("/api/usages?" + new URLSearchParams(this.q))
          .then(resp => resp.json())
          .then(users => {
            this.q.page = 0
            this.q.size = users.length
            this.tableData = users
            this.total = users.length
          }).catch(console.error)
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
