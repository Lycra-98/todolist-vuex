<template>
  <div id="app">
    <a-input placeholder="请输入任务" class="my_ipt" :value="inputValue" @change="handleInputChange"/>
    <a-button type="primary" @click="addListItem">添加事项</a-button>

    <a-list bordered :dataSource="infoList" class="dt_list">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- 复选框 -->
        <a-checkbox :checked="item.done" @change="cbStateChange(item.id, $event)">{{item.info}}</a-checkbox>
        <!-- 删除链接 -->
        <a slot="actions" @click="removeItemById(item.id)">删除</a>
      </a-list-item>

      <!-- footer区域 -->
      <div slot="footer" class="footer">
        <!-- 未完成的任务个数 -->
        <span>{{getCount}}条剩余</span>
        <!-- 操作按钮 -->
        <a-button-group>
          <a-button :type="viewKey === 'all' ? 'primary' : 'default'" @click="changeView('all')">全部</a-button>
          <a-button :type="viewKey === 'undone' ? 'primary' : 'default'" @click="changeView('undone')">未完成</a-button>
          <a-button :type="viewKey === 'done' ? 'primary' : 'default'" @click="changeView('done')">已完成</a-button>
        </a-button-group>
        <!-- 把已经完成的任务清空 -->
        <a @click="clean">清除已完成</a>
      </div>
    </a-list>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'app',
  data() {
    return {}
  },
  created() {
    // 发送请求
    this.$store.dispatch('getList')
  },
  computed: {
    ...mapState(['inputValue', 'viewKey']),
    ...mapGetters(['getCount', 'infoList'])
  },
  methods: {
    // 将文本框的值发生变化
    handleInputChange(e) {
      console.log(e.target.value)
      // 将改变值的同步到state中,调用对应的mutations
      this.$store.commit('setInpuetVal', e.target.value)
    },
    // 添加item项,同步到state中的list
    addListItem() {
      if (this.inputValue.trim().length === 0) {
        return this.$message.warning('请输入任务的名称')
      }
      // 调用用对应的mutation进行任务的添加
      this.$store.commit('addItem')
    },
    // 删除任务项
    removeItemById(id) {
      this.$store.commit('removeItem', id)
    },
    // 当复选框状态改变,同步到state中的
    cbStateChange(id, e) {
      // id为要修改状态的那一项任务,e.target.checked为复选框的状态
      // console.log(id, e.target.checked)
      const params = {
        id: id,
        done: e.target.checked
      }
      this.$store.commit('cbStateChange', params)
    },
    // 清除已完成的任务
    clean() {
      this.$store.commit('cleanDone')
    },
    // 点击不同的按钮,按钮高亮
    changeView(key) {
      // console.log(key)
      this.$store.commit('viewKeyChange', key)
    }
  }
}
</script>

<style scoped>
#app {
  padding: 10px;
}

.my_ipt {
  width: 500px;
  margin-right: 10px;
}

.dt_list {
  width: 500px;
  margin-top: 10px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
