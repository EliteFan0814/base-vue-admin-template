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

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 1. 若无 getInfo获取登录用户信息，也没有啥角色权限转换就用如下自定义方式自定义一个 admin 角色：
      const roles = ['admin']
      commit('SET_ROLES', roles)
      resolve({ roles })
      // 2. 若有权限管理，分角色展示，角色从getInfo 中获取，则采用如下方式：
      // getInfo(state.token)
      //   .then(response => {
      //     const { data } = response
      //     if (!data) {
      //       reject('Verification failed, please Login again.')
      //     }
      //     const { roles, name, avatar, introduction } = data
      //     // roles must be a non-empty array
      //     if (!roles || roles.length <= 0) {
      //       reject('getInfo: roles must be a non-null array!')
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
