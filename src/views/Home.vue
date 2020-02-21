<template>
  <div v-if="isLoggedIn" class="home-display isdesktop ismobile">
    <div
      style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px;"
    >
      <h1 class="tab-headtext">Dashboard</h1>
    </div>
    <div class="highlight-card-display">
      <div class="anlt-card short-card">
        <h3>Session</h3>
        <h1>{{ analyticData.all.sessions || '-' }}</h1>
      </div>
      <div class="anlt-card short-card">
        <h3>Users</h3>
        <h1>{{ analyticData.all.users || '-' }}</h1>
      </div>
      <div class="anlt-card short-card">
        <h3>New Users</h3>
        <h1>{{ analyticData.all.newUsers || '-' }}</h1>
      </div>
      <div class="anlt-card short-card">
        <h3>Page Views</h3>
        <h1>{{ analyticData.all.pageviews || '-' }}</h1>
      </div>
      <div class="anlt-card long-card">
        <h2>Social Network</h2>
        <table width="100%">
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
      <div class="anlt-card long-card">
        <h2>Browser</h2>
        <table width="100%">
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
      <div class="anlt-card long-card">
        <h2>Country</h2>
        <table width="100%">
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
      <div class="anlt-card long-card">
        <h2>Channel Grouping</h2>
        <table width="100%">
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
        all: {
          sessions: 230,
          users: 120,
          newUsers: 100,
          pageviews: 2000
        },
        dimensions: {
          socialNetwork: [
            {
              name: "Facebook",
              sessions: 6,
              users: 5,
              newUsers: 1,
              pageviews: 3
            },
            {
              name: "LINE",
              sessions: 6,
              users: 5,
              newUsers: 2,
              pageviews: 9
            }
          ],
          browser: [
            {
              name: "Chrome",
              sessions: 6,
              users: 5,
              newUsers: 1,
              pageviews: 3
            },
            {
              name: "Safari",
              sessions: 6,
              users: 5,
              newUsers: 0,
              pageviews: 9
            },
            {
              name: "Opera",
              sessions: 6,
              users: 5,
              newUsers: 0,
              pageviews: 9
            },
            {
              name: "Firefox",
              sessions: 6,
              users: 5,
              newUsers: 0,
              pageviews: 9
            }
          ],
          country: [
            {
              name: "Thailand",
              sessions: 6,
              users: 5,
              newUsers: 1,
              pageviews: 3
            },
            {
              name: "Singapore",
              sessions: 6,
              users: 5,
              newUsers: 0,
              pageviews: 9
            },
            {
              name: "Vietnam",
              sessions: 12,
              users: 10,
              newUsers: 3,
              pageviews: 12
            }
          ],
          channelGrouping: [
            {
              name: "Direct",
              sessions: 6,
              users: 5,
              newUsers: 1,
              pageviews: 3
            },
            {
              name: "Social",
              sessions: 6,
              users: 5,
              newUsers: 0,
              pageviews: 9
            },
            {
              name: "Organic Search",
              sessions: 6,
              users: 5,
              newUsers: 0,
              pageviews: 9
            }
          ]
        }
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
      axios
        .get("http://nhbee.kmutt.ac.th/admin/dashboard/analytic")
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
.table-card-display {
  width: calc(100vw - 200px);
  display: block;
}
.highlight-card-display {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
}
.anlt-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
}
.short-card {
  display: block;
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
  cursor: default;
}
.short-card:hover,
.long-card:hover {
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
  -webkit-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  border-radius: 5px;
}

.long-card {
  grid-column: span 2;
}
.short-card > h3 {
  color: #808080;
}
.short-card > h1 {
  font-size: 3rem;
  text-align: center;
  color: #c19d00;
}
.short-card > h3,
.long-card > h2 {
  color: #636363;
  border: 1px solid #d6d6d6;
  border-width: 0 0 1px 0;
  padding-bottom: 5px;
  text-align: left;
}
table > tr:first-child {
  height: 30px;
}
table > tr:first-child:hover {
  background-color: #fff;
}
table > tr:hover {
  background-color: #f1f1f1;
}
tr > td {
  border: 0;
}
tr > th {
  color: #808080;
  text-align: left;
}
</style>

