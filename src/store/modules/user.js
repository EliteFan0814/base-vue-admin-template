// import { login, logout, getInfo } from '@/api/user'
import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ account: username.trim(), password: password })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.mytoken.token)
          setToken(data.mytoken.token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info 通过此方法来获取用户的角色列表，进而进行动态路由的添加
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 方式1. 若无权限管理，用如下自定义方式自定义一个 admin 角色来访问所有路由：
      const roles = ['admin']
      commit('SET_ROLES', roles)
      resolve({ roles })

      // 方式2. 若有权限管理，通过 token 或其他方式 从 getInfo 中获取用户角色信息，则采用如下方式：
      // getInfo(state.token)
      //   .then(response => {
      //     const { data } = response
      //     if (!data) {
      //       reject('验证失败，请重新登录')
      //     }
      //     const { roles, name, avatar, introduction } = data
      //     // 角色必须是一个非空数组！！！
      //     if (!roles || roles.length <= 0) {
      //       reject('getInfo: 角色必须是一个非空数组')
      //     }
      //     commit('SET_ROLES', roles)
      //     commit('SET_NAME', name)
      //     commit('SET_AVATAR', avatar)
      //     commit('SET_INTRODUCTION', introduction)
      //     resolve(data)
      //   })
      //   .catch(error => {
      //     reject(error)
      //   })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resetRouter()

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })

          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {
        root: true
      })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
