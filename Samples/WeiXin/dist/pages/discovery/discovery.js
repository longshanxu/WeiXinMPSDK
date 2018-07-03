// pages/discovery/discovery.js
import { Qunji } from './../../utils/apis.js';

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    published: false,
    remoted: false,
    banner: [],
    articles: [],
    nowDay: new Date().getDate(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;

    Qunji.get(Qunji.Banner).then(res => {
      this.setData({ banner: res })
    })

    Qunji.get(Qunji.Articles).then(res => {
      this.setData({ articles: res })
    })

  },
  /**
   * Banner 点击事件
   */
  onBannerTap: function(event) {
    const {banner} = this.data;
    const {index} = event.currentTarget.dataset;
    console.log(index, banner);
    const urls = [];
    for(let item of banner) {
      urls.push(item.image)
    }
    wx.previewImage({
      current: urls[index],
      urls
    })
  },

  /**
   * 转发
   */
  onShareAppMessage: function (opt) {
    return {
      title: "寻找您身边的民星",
      path: "/pages/discovery/discovery",
      imageUrl: "http://xpic.588ku.com/figure/00/00/00/08/56/5355a15b1f68dfd.jpg!/fw/800",
      success: res => {
      },
      complete: res => {
      }
    };
  },

  onUnload(options) {
    this.subcription.unsubscribe()
    this.unbind()
  }

})