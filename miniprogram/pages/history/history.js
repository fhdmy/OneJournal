//index.js
const app = getApp()

Page({
  data: {
    historyTitle: ["时间", "品名", "总量", "余量", "增量", "使用者"],
    historyData: [],
    db: "",
    hiddenmodalput: true,
    sortRange: ['顺序', '逆序'],
    sort: "逆序",
    tempSort: "",
    dateStart: "2018-01-01",
    tempDateStart: "",
    dateEnd: "2018-01-01",
    tempDateEnd: "",
    showHistoryData: [],
    classRange: ['全部'],
    belongRange: ['全部'],
    classChosen:"全部",
    belongChosen:"全部",
    dateSortAllRange:['是','否'],
    dateSortAll:'是',
    tempDateSortAll:''
  },
  onLoad: function (options) {
    let _this = this;
    _this.data.db = options.db;
    let time = new Date();
    _this.setData({
      dateStart: time.getFullYear() + '-01-01',
      dateEnd: time.getFullYear() + '-12-31',
    });
  },
  onShow: function () {
    let _this = this;
    wx.cloud.callFunction({
      name: 'getGoodsHistory',
      data: {
        dataBase: _this.data.db
      },
      success: (res) => {
        let k = 0;
        let len = _this.data.showHistoryData.length;
        for (let i = res.result.data.length - 1; i >= 0; i--) {
          //品名
          let findClass = false;
          for (let p = 0; p < _this.data.classRange.length; p++) {
            if (_this.data.classRange[p] == res.result.data[i].classes) {
              findClass = true;
              break;
            }
          }
          if (!findClass) {
            let o = "classRange[" + _this.data.classRange.length+"]"
            _this.setData({
              [o]: res.result.data[i].classes
            })
          }
          //使用者
          findClass = false;
          for (let p = 0; p < _this.data.belongRange.length; p++) {
            if (_this.data.belongRange[p] == res.result.data[i].belongName) {
              findClass = true;
              break;
            }
          }
          if (!findClass) {
            let o = "belongRange[" + _this.data.belongRange.length + "]"
            _this.setData({
              [o]: res.result.data[i].belongName
            })
          }
          _this.data.showHistoryData[k]={
            classes: res.result.data[i].classes,
            remain: res.result.data[i].remain,
            sum: res.result.data[i].sum,
            use: res.result.data[i].use,
            date: res.result.data[i].date,
            belong: res.result.data[i].belongName,
            claddingUid: res.result.data[i]._id,
            classUid: res.result.data[i].classUid,
            remark: res.result.data[i].remark
          }
          k++;
        }
        if(k<len){
          _this.data.showHistoryData.splice(k, len - k);
        }
        _this.data.historyData = _this.data.showHistoryData;
        _this.sort();
      },
      fail: (res) => {
        console.log(res);
        wx.showToast({
          title: '网络传输故障',
          image: '/images/about.png'
        })
      }
    });
  },
  openDetail: function (e) {
    let index = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + this.data.showHistoryData[index].claddingUid + '&db=' + this.data.db + 'History&classes=' + this.data.showHistoryData[index].classes + '&sum=' + this.data.showHistoryData[index].sum + "&use=" + this.data.showHistoryData[index].use + '&date=' + this.data.showHistoryData[index].date + "&classUid=" + this.data.showHistoryData[index].classUid + "&remark=" + this.data.showHistoryData[index].remark,
    })
  },
  chooseShow: function (e) {
    let _this = this;
    let index = e.currentTarget.id;
    //时间
    if (index == 0) {
      this.setData({
        tempSort: this.data.sort,
        tempDateStart: this.data.dateStart,
        tempDateEnd: this.data.dateEnd,
        tempDateSortAll:this.data.dateSortAll,
        hiddenmodalput: false
      })
    }
  },
  confirm: function () {
    this.data.sort = this.data.tempSort;
    this.data.dateStart = this.data.tempDateStart;
    this.data.dateEnd = this.data.tempDateEnd;
    this.data.dateSortAll=this.data.tempDateSortAll;
    this.sort();
    this.setData({
      hiddenmodalput: true
    })
  },
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    })
  },
  changeSort: function (e) {
    this.setData({
      tempSort: this.data.sortRange[e.detail.value]
    })
  },
  changeStart: function (e) {
    this.setData({
      tempDateStart: e.detail.value
    })
  },
  changeEnd: function (e) {
    this.setData({
      tempDateEnd: e.detail.value
    })
  },
  changeSortAll:function(e){
    this.setData({
      tempDateSortAll: this.data.dateSortAllRange[e.detail.value]
    })
  },
  sort: function () {
    let tempSort = this.data.historyData;
    //时间
    let start = new Date(this.data.dateStart);
    let end = new Date(this.data.dateEnd);
    let temp = [];
    let k = 0;
    for (let i = 0; i < tempSort.length; i++) {
      let d = new Date(tempSort[i].date);
      let classJudge = this.data.classChosen == '全部' ? true : (this.data.classChosen == tempSort[i].classes);
      let belongJudge = this.data.belongChosen == '全部' ? true : (this.data.belongChosen == tempSort[i].belong);
      let dateJudge = this.data.dateSortAll == '是' ? true : (d >= start && d <= end);
      if (dateJudge && classJudge && belongJudge) {
        temp[k] = tempSort[i];
        k++;
      }
    }
    //冒泡排序
    let finish = true;
    for (let i = 0; i < temp.length; i++) {
      for (let j = 0; j < temp.length - i - 1; j++) {
        if (this.data.sort == '逆序') {
          if (new Date(temp[j].date) < new Date(temp[j + 1].date)) {
            let t = temp[j];
            temp[j] = temp[j + 1];
            temp[j + 1] = t;
            finish = false;
          }
        }
        else {
          if (new Date(temp[j].date) > new Date(temp[j + 1].date)) {
            let t = temp[j];
            temp[j] = temp[j + 1];
            temp[j + 1] = t;
            finish = false;
          }
        }
      }
      if (finish)
        break;
    }
    this.setData({
      showHistoryData: temp
    })
  },
  changeClass:function(e){
    this.setData({
      classChosen: this.data.classRange[e.detail.value]
    })
    this.sort();
  },
  changeBelong:function(e){
    this.setData({
      belongChosen: this.data.belongRange[e.detail.value]
    })
    this.sort();
  }
})
