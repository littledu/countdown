/*
 * @components countdown 倒计时
 * @author littledu  http://www.cnblogs/littledu
 *
 * @调用方式   
 * countdown({
    id: 'countdown',
    date: 'December,31,2012,18:06:00',
    leadingZero: true,
    htmlTemplate: '使用客户端时间：<i class="day">%{d}天</i><i class="hour">%{h}时</i><i class="minute">%{m}分</i><i class="second">%{s}秒</i>',
    onComplete: function(){}
  });
 * @property
 *      id：{String | Element} (必选)：想插入倒计时的位置id或dom元素
 *
 *      date:{String} (必选) 倒计时结束时间  格式：December,31,2012,18:06:00
 *           附月份英语: 一月 January 二月 February 三月 Marcy 四月 April 五月 May 六月 June
 *            七月 July 八月 August 九月 September 十月 October 十一月 November 十二月 December
 *
 *      leadingZero: {Boolean} (可选) 位数不足两位补0，如 0天8时49分 =》00天08时49分 默认为false
 *      
 *      useServerTime: {Boolean} (可选) true则使用服务器时间，false则使用客户端时间
 *
 *      htmlTemplate: {String} (可选) 倒计时html模版 如
 *      <i class="day">%{d}天</i><i class="hour">%{h}时</i><i class="minute">%{m}分</i><i class="second">%{s}秒</i>
 *
 *      onComplete: {Function} (可选) 当倒计时完成时回调函数
 *
 * @version v1.0
 *
 */
var countdown = function(options) {
    var $ = function(id) {
            return typeof id === 'string' ? document.getElementById(id) : id;
        };

    var id = options.id,
        date = options.date,
        leadingZero = options.leadingZero || false,
        htmlTemplate = options.htmlTemplate || '<i class="day">%{d}天</i><i class="hour">%{h}时</i><i class="minute">%{m}分</i><i class="second">%{s}秒</i>',
        onComplete = options.onComplete || function() {}, 
        countdownDay = new Date(date).getTime(),
        useServerTime = options.useServerTime || false, 
        rDate = /(%\{d\}|%\{h\}|%\{m\}|%\{s\})/g, 
        rDays = /%\{d\}/, 
        rHours = /%\{h\}/, 
        rMins = /%\{m\}/, 
        rSecs = /%\{s\}/, 
        floor = Math.floor,
        tLeft, dLeft, hLeft, mLeft, sLeft, html, servertime,nowTime,timer = null,xmlHttp = null;

    xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

    function zero(num) {
        if(num <= 9) {
            return '0' + num;
        }

        return num;
    }

    function getSeverTime() {
        xmlHttp.open('HEAD', '.', false);
        xmlHttp.setRequestHeader("Range", "bytes=-1");
        xmlHttp.send(null);
        return new Date(xmlHttp.getResponseHeader("Date")).getTime();
    }

    nowTime = useServerTime ? getSeverTime() - 1000 : new Date().getTime() - 1000;

    (function showTime() {
        nowTime += 1000;
        tLeft = countdownDay - nowTime;
        dLeft = floor(tLeft / 86400000);
        hLeft = floor((tLeft % 86400000) / 3600000);
        mLeft = floor((tLeft % 86400000 % 3600000) / 60000);
        sLeft = floor((tLeft % 86400000 % 3600000 % 60000) / 1000);

        if(leadingZero) {
            dLeft = zero(dLeft);
            hLeft = zero(hLeft);
            mLeft = zero(mLeft);
            sLeft = zero(sLeft);
        }

        if(tLeft >= 0) {
            html = htmlTemplate.replace(rDays, dLeft).replace(rHours, hLeft).replace(rMins, mLeft).replace(rSecs, sLeft);
        } else {
            html = htmlTemplate.replace(rDate, '00');
            clearTimeout(timer);
            onComplete();
            return;
        }

        $(id).innerHTML = html;

        timer = setTimeout(showTime,1000);
    })();

}