<template>
  <div class="dashboard-container app-main">
    <div class="data-wrap">
      <div v-for="(item,index) in dataList" :key="index" class="data-item">
        <div class="data-content">
          <div class="left">
            <img :src="item.img" alt="">
          </div>
          <div class="right">
            <div class="name">{{item.name}}</div>
            <div class="value">{{item.value}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      dataList: [
        {
          img: require('@/assets/imgs/dashboard/flow.svg'),
          name: '今日访问数',
          value: 0
        },
        {
          img: require('@/assets/imgs/dashboard/flow.svg'),
          name: '今日访问数',
          value: 0
        },
        {
          img: require('@/assets/imgs/dashboard/flow.svg'),
          name: '今日访问数',
          value: 0
        },
        {
          img: require('@/assets/imgs/dashboard/flow.svg'),
          name: '今日访问数',
          value: 0
        },
        {
          img: require('@/assets/imgs/dashboard/flow.svg'),
          name: '今日访问数',
          value: 0
        },
        {
          img: require('@/assets/imgs/dashboard/flow.svg'),
          name: '今日访问数',
          value: 0
        },
        {
          img: require('@/assets/imgs/dashboard/flow.svg'),
          name: '今日访问数',
          value: 0
        },
        {
          img: require('@/assets/imgs/dashboard/flow.svg'),
          name: '今日访问数',
          value: 0
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['name'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    background-color: #f0f2f5;
    .data-wrap {
      padding: 20px;
      display: flex;
      flex-wrap: wrap;
      .data-item {
        width: 25%;
        padding: 20px;
        .data-content {
          background-color: #fff;
          padding: 20px;
          box-shadow: 4px 4px 40px rgb(0 0 0 / 5%);
          border-color: rgba(0, 0, 0, 0.05);
          &:hover {
            box-shadow: 0px 0px 20px rgb(26 115 232 / 30%);
            cursor: pointer;
          }
          display: flex;
          justify-content: space-between;
          align-items: center;
          .left {
            img {
              width: 50px;
            }
          }
          .right {
            text-align: right;
            .name {
              color: rgba(0, 0, 0, 0.45);
              font-size: 16px;
              margin-bottom: 12px;
            }
            .value {
              color: rgb(102, 102, 102);
              font-size: 20px;
            }
          }
        }
      }
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
