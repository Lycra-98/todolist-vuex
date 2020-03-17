import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 任务列表数组
    list: [],
    // 文本框的值
    inputValue: '',
    // 下一个任务的id
    nextId: 5,
    // 按钮高亮
    viewKey: 'all'
  },
  mutations: {
    // 将获取的数据赋值给list
    initList(state, list) {
      state.list = list
    },
    // 将页面的文本框的值发生改变后重新赋值inputValue
    setInpuetVal(state, val) {
      state.inputValue = val
    },
    // 往list数组中添加任务
    addItem(state) {
      // 定义添加的对象
      const obj = {
        id: state.nextId,
        info: state.inputValue,
        done: false
      }
      // 将任务对象添加到list数组中
      state.list.push(obj)
      state.nextId++
      state.inputValue = ''
    },
    // 删除任务项
    removeItem(state, id) {
      // 根据id在数组中找到对应的索引
      const index = state.list.findIndex(item => item.id === id)
      // 如果有该索引则在数组中删除
      if (index !== -1) {
        state.list.splice(index, 1)
      }
    },
    // 改变复选框状态
    cbStateChange(state, params) {
      // 修改list中对应的元素的done属性
      state.list.some(item => {
        if (item.id === params.id) {
          item.done = params.done
          return true
        }
      })
    },
    // 清除已完成的任务
    cleanDone(state) {
      state.list = state.list.filter(item => item.done === false)
    },
    // 点击按钮改变按钮高亮
    viewKeyChange(state, key) {
      state.viewKey = key
    }
  },
  actions: {
    // 发送axios请求获取列表数据
    getList(context) {
      axios.get('/list.json').then(({ data }) => {
        console.log(data)
        // 触发initList函数进行对state中的数据赋值操作
        context.commit('initList', data)
      })
    }
  },
  getters: {
    // 计算未完成的任务的条数
    getCount(state) {
      const newArr = state.list.filter(item => item.done === false)
      return newArr.length
    },
    // 返回不同任务数组
    infoList(state) {
      if (state.viewKey === 'all') {
        return state.list
      }
      if (state.viewKey === 'undone') {
        return state.list.filter(item => item.done === false)
      }
      if (state.viewKey === 'done') {
        return state.list.filter(item => item.done === true)
      }
      return state.list
    }
  }
})
