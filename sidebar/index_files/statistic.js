
var IdolStatistic = (function($, win, undefined){

	var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = window.console || {};

    while (length--) {
        // Only stub undefined methods.
        console[methods[length]] = console[methods[length]] || noop;
    }

	var statistic = {
		_roomid:null,

		initRoom:function(roomid){
			this._roomid = roomid;
		},

		getRoomOlNum: function(callback) {
			if (!this._roomid) {
				console.log('no roomid specified');
				return;
			}

			$.getJSON('http://statistic.idol001.com/club/?callback=?&action=getolnum&roomid='+this._roomid, callback);
		},
	}

	return statistic;
})(jQuery, window)