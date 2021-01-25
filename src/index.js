//components
import Complain from './Complain'
//css相关
import './index.global.css'

// 获取谷歌浏览器版本
function getChromeVersion() {
    var arr = navigator.userAgent.split(' ');
    var chromeVersion = '';
    for(var i=0;i < arr.length;i++){
        if(/chrome/i.test(arr[i]))
            chromeVersion = arr[i]
    }
    if(chromeVersion){
        return Number(chromeVersion.split('/')[1].split('.')[0]);
    } else {
        return false;
    }
}

if(getChromeVersion()) {
    var version = getChromeVersion();
    if(version <= 65) {
        alert('您使用的浏览器版本过低，为了更好地体验请使用谷歌浏览器并升级到最新版本！');
    }
}

export default {
    Complain:Complain
};

