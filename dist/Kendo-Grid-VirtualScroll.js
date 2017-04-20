(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jQuery"));
	else if(typeof define === 'function' && define.amd)
		define(["jQuery"], factory);
	else if(typeof exports === 'object')
		exports["kendoGridVS"] = factory(require("jQuery"));
	else
		root["kendoGridVS"] = factory(root["jQuery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(0);

var InfiniteScroll = (function () {
  var defaults = {
    bottomPixels: 50,
    fireOnce: true,
    intervalFrequency: 250,
    resetCounter: function () {
      return false;
    },
    callback: function () {
      return true;
    },
    ceaseFire: function () {
      return false;
    }
  };

  function InfiniteScroll(scope, options) {
    var _this = this;
    this.options = $.extend({}, defaults, options);
    this.firing = true;
    this.fired = false;
    this.scrollDirection = 'next';
    this.fireSequence = 0;
    this.didScroll = false;
    this.isScrollable = true;
    this.target = scope;
    this.targetId = "";
    this.lastScrollTop = 0;
    this.innerWrap = $(".infinite_scroll_inner_wrap", this.target);
    this.delayFire = function (value) {
      _this.fired = value;
      $(_this.target).scrollTop(_this.lastScrollTop);
    };

    $(scope).scroll(function () {
      _this.detectTarget(scope);
      return _this.detectScrollDirection();
    });
  }

  InfiniteScroll.prototype.run = function () {
    var _this = this;
    return setInterval((function () {
      if (_this.shouldTryFiring()) {
        _this.didScroll = false;
        if (_this.ceaseFireWhenNecessary()) {
          return;
        }
        if (_this.shouldBeFiring()) {
          _this.resetFireSequenceWhenNecessary();
          _this.acknowledgeFiring();
          _this.fireCallback();
          return;
        }
      }
    }), this.options.intervalFrequency);
  };

  InfiniteScroll.prototype.detectTarget = function (scope) {
    this.target = scope;
    return this.targetId = $(this.target).attr('id');
  };

  InfiniteScroll.prototype.detectScrollDirection = function () {
    var currentScrollTop;
    this.didScroll = true;
    currentScrollTop = $(this.target).scrollTop();
    if (currentScrollTop > this.lastScrollTop) {
      this.scrollDirection = 'next';
    } else {
      this.scrollDirection = 'prev';
    }
    return this.lastScrollTop = currentScrollTop;
  };

  InfiniteScroll.prototype.shouldTryFiring = function () {
    return this.didScroll && this.firing === true;
  };

  InfiniteScroll.prototype.ceaseFireWhenNecessary = function () {
    if (this.options.ceaseFire.apply(this.target, [this.fireSequence])) {
      this.firing = false;
      return true;
    } else {
      return false;
    }
  };

  InfiniteScroll.prototype.wrapContainer = function () {
    if (this.innerWrap.length === 0) {
      return this.innerWrap = $(this.target).wrapInner("<div class=\"infinite_scroll_inner_wrap\" />").find(".infinite_scroll_inner_wrap");
    }
  };

  InfiniteScroll.prototype.isScrollableOrNot = function () {
    if (this.target === document || this.target === window) {
      return this.isScrollable = $(document).height() - $(window).height() <= $(window).scrollTop() + this.options.bottomPixels;
    } else {
      this.wrapContainer();
      return this.isScrollable = this.innerWrap.length > 0 && (this.innerWrap.height() - $(this.target).height() <= $(this.target).scrollTop() + this.options.bottomPixels);
    }
  };

  InfiniteScroll.prototype.shouldBeFiring = function () {
    this.isScrollableOrNot();
    return this.isScrollable && (this.options.fireOnce === false || (this.options.fireOnce === true && this.fired !== true));
  };

  InfiniteScroll.prototype.resetFireSequenceWhenNecessary = function () {
    if (this.options.resetCounter.apply(this.target) === true) {
      return this.fireSequence = 0;
    }
  };

  InfiniteScroll.prototype.acknowledgeFiring = function () {
    this.fired = true;
    return this.fireSequence++;
  };

  InfiniteScroll.prototype.fireCallback = function () {
    return this.options.callback.apply(this.target, [this.fireSequence, this.scrollDirection, this.delayFire]);
  };

  return InfiniteScroll;

})();


var kendoGridVS = function (kendoOptions) {
  var _data = null;

  var _dataSource = kendoOptions.gridElement.data('kendoGrid').dataSource;
  var _gridContent = kendoOptions.gridElement.children(".k-grid-content");

  var _totalRows = _dataSource.total();
  var _pageSize  = _dataSource.pageSize();
  var _group     = _dataSource.group();
  var _isGrouped = false;

  if(typeof _group !== 'undefined' && _group.length > 0){
    _isGrouped = true;
  }

  var _dataSourceQuery = function (params, callback, delayFire) {
    _dataSource.query(params).then(function (e) {
      callback();
      delayFire(false);
    });
  };

  var _normalDataAppend = function () {
    var view = _dataSource.view();
    for (var i = 0; i < view.length; i++) {
      _data.push(view[i]);
    }
    _dataSource.data(_data);
  };

  var _groupedDataAppend = function () {
    var view = _dataSource.view();
    var lastCat = _data[_data.length - 1].value;
    var newCat = view[0].value;
    if (lastCat === newCat) {
      var firstItems = view[0].items;
      for (var i = 0; i < firstItems.length; i++) {
        _data[_data.length - 1].items.push(firstItems[i]);
      }
      for (var j = 1; j < view.length; j++) {
        _data.push(view[j]);
      }
    } else {
      for (var k = 0; k < view.length; k++) {
        _data.push(view[k]);
      }
    }
    _dataSource.data(_data);
  };

  _dataSource.page(1);
  return new InfiniteScroll(_gridContent, {
    callback: function (fireSequence, scrollDirection, delayFire) {
      _data = _dataSource.data();
      if ((Math.ceil(_totalRows / _pageSize) >= _dataSource.page() + 1) && scrollDirection === 'next') {
        if (!_isGrouped) {
          _dataSourceQuery({
            page: _dataSource.page() + 1,
            pageSize: _pageSize
          }, _normalDataAppend, delayFire);
        } else {
          _dataSourceQuery({
            page: _dataSource.page() + 1,
            pageSize: _pageSize,
            group: _group
          }, _groupedDataAppend, delayFire)
        }
      }
    }
  }).run();
};


module.exports = kendoGridVS;




/***/ })
/******/ ]);
});