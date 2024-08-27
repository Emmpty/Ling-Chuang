import { attestAdd } from '../api/index.js'
import { getUploadUrl } from "@/static/api/draw.js";

// 手机号码加
function formatTel(tel) {
  tel = "" + tel;
  let newTel = tel.substr(0, 3) + "****" + tel.substr(7)
  return newTel;
}

// 下载图片
function downLoadImage(url) {
  uni.showLoading({ title: '' });
  uni.downloadFile({
    url: url,
    success: (res) => {
      uni.hideLoading();
      if (res.statusCode === 200) {
        uni.getSetting({
          success(scopeRes) {
            if (!scopeRes.authSetting['scope.writePhotosAlbum']) {
              uni.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  uni.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: (res) => {
                      uni.showToast({ title: "保存成功", duration: 3000, icon: 'none' })
                    },
                    fail: (err) => {
                      console.error('authorize', err);
                      uni.showToast({ title: "保存失败", duration: 3000, icon: 'none' })
                    }
                  });
                }
              });
            } else {
              uni.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: (res) => {
                  uni.showToast({ title: "保存成功", duration: 3000, icon: 'none' })
                },
                fail: (err) => {
                  console.error('saveImageToPhotosAlbum', err);
                  uni.showToast({ title: "保存失败", duration: 3000, icon: 'none' })
                }
              });
            }
          }
        });
      }
    },
    fail: (err) => {
      console.error('downloadFile', err);
    }
  });
}

// 去除空格
function clearSpaces(ele) {
  if (typeof ele === 'string') {
    return ele.split(/[\t\r\f\n\s]*/g).join('');
  }
}

//把base64转换成图片
function getBase64ImageUrl(data) {
  const arrayBuffer = uni.base64ToArrayBuffer(data);
  const blob = new Blob([arrayBuffer], { type: 'image/png' });
  const imgUrl = URL.createObjectURL(blob);
  return imgUrl;
}

function getTime() {
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
  var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate()
  var hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours()
  var minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
  var second = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
  return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

// 添加存证
async function attestAddFun(id) {
  uni.showLoading({
    title: '申请存证中...',
    mask: true,
  })
  try {
    const res = await attestAdd({ id: id })
    uni.hideLoading()
    if (res.code == 200) {
      uni.showModal({
        title: '温馨提示',
        content: '区块链存证申请成功',
        success: function (res) {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pmnie/mnie/evidence',
            })
          }
        }
      });
    } else if (res.code == 888) {
      uni.showModal({
        title: '温馨提示',
        content: '存证次数不足，是否前往充值',
        success: function (res) {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pmnie/mnie/recharge?epindex=point'
            })
          }
        }
      });
    }
  } catch (error) {
    uni.hideLoading()
  }
}

function contactCustomer() {
  let corpid = 'ww09bf32f49f8297b2'
  // kfcffe55ec59e632f71
  let customerServiceUrl = 'https://work.weixin.qq.com/kfid/kfc3f5619aa37fd90c8'
  // #ifdef MP 
  wx.openCustomerServiceChat({
    corpId: corpid,
    extInfo: { url: customerServiceUrl },
    success: (res) => {
      console.log('openCustomerServiceChat success', res)
    },
    fail: (err) => {
      console.error('openCustomerServiceChat error', err)
    }
  })
  // #endif

  // #ifdef H5
  window.open(customerServiceUrl, '_blank');
  // #endif

  // #ifdef APP-PLUS
  let wechat = null
  plus.share.getServices(res => {
    wechat = res.find(i => i.id === 'weixin')
    if (wechat) {
      wechat.openCustomerServiceChat({
        corpid: corpid,//企业ID
        url: customerServiceUrl,//客服地址
      }, (src) => {
        console.log('openCustomerServiceChat success', src)
      }, (err) => {
        console.error('openCustomerServiceChat error', err)
      })
    } else {
      uni.showToast({
        title: '当前环境不支持微信操作', icon: "error"
      });
    }
  });
  // #endif
}

/**
* 画板输入文字自动识别尺寸、算法
* @param {String} str 需要格式化的字符串 
* @param {String} keyword 替换成哪个字母 ar | v
* @param {String} keywordCapital 通配字母的大小写 ([aA][rR]) ([vV])
* "——" 替换成 "--"
* 中间可带可不带空格,前后无限空格的
*/
function regFormat(str, keyword = 'ar', keywordCapital = '([aA][rR])') {
  // |(\\d+(\\.\\d?$))
  let regex = new RegExp(`(^|\\s*)(-+|—+)${keywordCapital}(\\s*)(\\d+(:|：)\\d+|\\d(\\.\\d)?)`, "g");

  const result = str.replace(regex, (match, p1, p2, p3, p4, p5, p6) => {
    console.log('-----------------match', match, ',', p1, ',', p2, ',', p3, ',', p4, ',', p5, ',', p6);
    // 判断是哪个子模式被匹配
    if (p5) {
      // 如果匹配的是第五个捕获组（\\d+(:|：)\\d+）
      return ` --${keyword} ${p5}`;
    } else if (keyword == 'v' && p4) {
      // 如果匹配的是第六个捕获组（\\d(\\.\\d)）
      return ` --${keyword} ${p4}`;
    }
  })
  return result
}


// 复制文案
function copyText(text) {
  console.log('>>>>>>>>>', text);
  // #ifdef H5
  copyTextH5(text)
  // #endif  
  // #ifndef H5
  uni.setClipboardData({
    data: text + '',
    success: () => {
      uni.showToast({ title: "复制成功", icon: 'none', duration: 4000 })
    }, fail: (err) => {
      console.error(err);
    }
  });
  // #endif  
}
function copyTextH5(text) {
  const textString = text.toString();
  let input = document.querySelector('#copy-input');
  if (!input) {
    input = document.createElement('input');
    input.id = "copy-input";
    input.readOnly = "readOnly";        // 防止ios聚焦触发键盘事件
    input.style.position = "absolute";
    input.style.left = "-1000px";
    input.style.zIndex = "-1000";
    document.body.appendChild(input)
  }
  input.value = textString;
  // ios必须先选中文字且不支持 input.select();
  selectText(input, 0, textString.length);
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    Toast('复制成功');
  } else {
    console.log('不兼容');
  }
  input.blur();
  // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
  // 选择文本。createTextRange(setSelectionRange)是input方法
  function selectText(textbox, startIndex, stopIndex) {
    if (textbox.createTextRange) {//ie
      const range = textbox.createTextRange();
      range.collapse(true);
      range.moveStart('character', startIndex);//起始光标
      range.moveEnd('character', stopIndex - startIndex);//结束光标
      range.select();//不兼容苹果
    } else {//firefox/chrome
      textbox.setSelectionRange(startIndex, stopIndex);
      textbox.focus();
    }
  }
}

function checkImage(path) {
  return new Promise(async (resolve, reject) => {
    uni.getImageInfo({
      src: path,
      success: (image) => {
        console.log(image.width);
        console.log(image.height);
        if (image.width * image.height <= 500000) {
          resolve(true)
        } else {
          resolve(false)
        }
      },
      fail: (error) => {
        console.error(error);
        reject(false)
      }
    });
  })
}

async function upLoadImage(filePath) {
  return new Promise(async (resolve, reject) => {
    try {
      // 获取上传图片所需参数、上传地址
      const { result } = await getUploadUrl()
      let formData = result.post.formData
      let url = result.post.url
      let attachment = result.id

      uni.uploadFile({
        url: url,
        filePath: filePath,
        name: 'file',
        method: 'POST',
        formData: formData,
        success: async (res) => {
          let Param = { attachment: attachment }
          resolve(Param)
        },
        fail: (err) => {
          console.log('uploadFile error', err,)
          reject(err)
        },
      });
    } catch (error) {
      reject(error)
      console.error(error);
    }
  })
}

export default {
  formatTel,
  downLoadImage,
  clearSpaces,
  getTime,
  getBase64ImageUrl,
  attestAddFun,
  contactCustomer,
  regFormat,
  copyText,
  checkImage,
  upLoadImage,
}