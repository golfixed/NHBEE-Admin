<template>
  <div v-if="isLoggedIn" class="home-display isdesktop ismobile">
    <div
      style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px;"
    >
      <h1 class="tab-headtext">Dashboard</h1>
    </div>
    <div>
      <div class="test-all">Session: {{ analyticData.all.sessions || '-' }}</div>
      <div class="test-all">Users: {{ analyticData.all.users || '-' }}</div>
      <div class="test-all">New Users: {{ analyticData.all.newUsers || '-' }}</div>
      <div class="test-all">Page Views: {{ analyticData.all.pageviews || '-' }}</div>
    </div>
    <div>
      <div class="test-dimension">
        <h2>Social Network</h2>
        <table width="100%" border="1">
          <tr>
            <th>Name</th>
            <th>Sessions</th>
            <th>Users</th>
            <th>New Users</th>
            <th>Page Views</th>
          </tr>
          <tr v-for="(row, i) in analyticData.dimensions.socialNetwork" :key="'sn_tr_' + i">
            <td>{{ row.name || '-' }}</td>
            <td>{{ row.sessions || '-' }}</td>
            <td>{{ row.users || '-' }}</td>
            <td>{{ row.newUsers || '-' }}</td>
            <td>{{ row.pageviews || '-' }}</td>
          </tr>
        </table>
      </div>
      <div class="test-dimension">
        <h2>Browser</h2>
        <table width="100%" border="1">
          <tr>
            <th>Name</th>
            <th>Sessions</th>
            <th>Users</th>
            <th>New Users</th>
            <th>Page Views</th>
          </tr>
          <tr v-for="(row, i) in analyticData.dimensions.browser" :key="'bs_tr_' + i">
            <td>{{ row.name || '-' }}</td>
            <td>{{ row.sessions || '-' }}</td>
            <td>{{ row.users || '-' }}</td>
            <td>{{ row.newUsers || '-' }}</td>
            <td>{{ row.pageviews || '-' }}</td>
          </tr>
        </table>
      </div>
      <div class="test-dimension">
        <h2>Country</h2>
        <table width="100%" border="1">
          <tr>
            <th>Name</th>
            <th>Sessions</th>
            <th>Users</th>
            <th>New Users</th>
            <th>Page Views</th>
          </tr>
          <tr v-for="(row, i) in analyticData.dimensions.country" :key="'ct_tr_' + i">
            <td>{{ row.name || '-' }}</td>
            <td>{{ row.sessions || '-' }}</td>
            <td>{{ row.users || '-' }}</td>
            <td>{{ row.newUsers || '-' }}</td>
            <td>{{ row.pageviews || '-' }}</td>
          </tr>
        </table>
      </div>
      <div class="test-dimension">
        <h2>Channel Grouping</h2>
        <table width="100%" border="1">
          <tr>
            <th>Name</th>
            <th>Sessions</th>
            <th>Users</th>
            <th>New Users</th>
            <th>Page Views</th>
          </tr>
          <tr v-for="(row, i) in analyticData.dimensions.channelGrouping" :key="'cg_tr_' + i">
            <td>{{ row.name || '-' }}</td>
            <td>{{ row.sessions || '-' }}</td>
            <td>{{ row.users || '-' }}</td>
            <td>{{ row.newUsers || '-' }}</td>
            <td>{{ row.pageviews || '-' }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import layout_default from "@/layouts/main.vue";
import layout_login from "@/layouts/login.vue";
import axios from "@/axios.js";

export default {
  name: "home",
  components: {},
  data() {
    return {
      analyticData: {
        all: {},
        dimensions: {}
      }
    };
  },
  created() {
    if (this.isLoggedIn) {
      this.$emit(`update:layout`, layout_default);
      this.getAnalyticData();
    } else this.$emit(`update:layout`, layout_login);
  },
  watch: {
    isLoggedIn(newval) {
      if (newval) {
        this.$emit(`update:layout`, layout_default);
        this.getAnalyticData();
      } else this.$emit(`update:layout`, layout_login);
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    }
  },
  methods: {
    getAnalyticData() {
      axios("/admin/dashboard/analytic")
        .then(response => {
          this.analyticData = response.data;
        })
        .catch(error => {
          if (error.response && error.response.data)
            console.error("get analytic", error.response.data.error);
          else console.error("get analytic", error.message);
        });
    }
  }
};
</script>
<style scoped>
.home-display {
  width: 1200px;
}
.test-all {
  display: inline-table;
  width: 275px;
  margin: 12px;
  font-size: 2rem;
  font-weight: 900;
}
.test-dimension {
  display: inline-table;
  width: 575px;
  margin: 12px;
}
</style>

