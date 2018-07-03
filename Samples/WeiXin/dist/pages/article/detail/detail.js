// pages/article/detail.js
import { Qunji } from './../../../utils/apis.js';
var WxParse = require('./../../common/wxParse/wxParse.js');
import { $markShare } from './../../common/index.js'




Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    checked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    //this.fetchDetails(Number(options.id))

    Qunji.get(Qunji.GetArticlesByID + options.id).then(res => {
      that.setData({ detail:res }, () => {
        WxParse.wxParse('article', 'html', that.data.detail['content'], that);
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },


  /**
   * 💓 / 💔
   */
  handleFavChange(e) {
    const { checked, detail } = this.data;
    this.setData({ checked: !checked })
  
  },

  /**
   * 评论
   */
  handleComment(e) {
    wx.showToast({
      title: '购买跳转链接',
    })
  },

  /**
   * 分享
   */
  handleShare(e) {
    $markShare.show({
      titleText: '',
      buttons: [
        { iconPath: '/assets/images/weixin_icon.png', title: '微信好友', openType: 'share' },
        { iconPath: '/assets/images/weixin_circle_icon.png', title: '微信朋友圈' },
        { iconPath: '/assets/images/qq_icon.png', title: 'QQ好友' },
        { iconPath: '/assets/images/qq_zone_icon.png', title: 'QQ空间' },
        { iconPath: '/assets/images/weibo_icon.png', title: '微博' },
        { iconPath: '/assets/images/copy_link_icon.png', title: '复制链接' },
        { iconPath: '/assets/images/share_more_icon.png', title: '更多' },
      ],
      buttonClicked(index, item) {
        if (!item.openType)
          if(index==5) {
            wx.setClipboardData({
              data: 'https://github.com/Hongye567/weapp-mark',
              success: res => {
                wx.showToast({
                  title: '已复制到剪贴板',
                })
              }
            })
          } else {
            wx.showModal({
              content: item.title,
            })
          }
        return true;
      }
    })
  }
})