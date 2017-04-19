var $ = require('jquery');

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

  if (kendoOptions.initDataBound) {
    var data = null;

    var dataSource = kendoOptions.gridElement.data('kendoGrid').dataSource;
    var gridContent = kendoOptions.gridElement.children(".k-grid-content");

    var _dataSourceQuery = function (params, callback, delayFire) {
      dataSource.query(params).then(function (e) {
        callback();
        delayFire(false);
      });
    };

    var _normalDataAppend = function () {
      var view = dataSource.view();
      for (var i = 0; i < view.length; i++) {
        data.push(view[i]);
      }
      dataSource.data(data);
    };

    var _groupedDataAppend = function () {
      var view = dataSource.view();


      var lastCat = data[data.length - 1].value;
      var newCat = view[0].value;
      if (lastCat === newCat) {
        var firstItems = view[0].items;
        for (var i = 0; i < firstItems.length; i++) {
          data[data.length - 1].items.push(firstItems[i]);
        }
        for (var j = 1; j < view.length; j++) {
          data.push(view[j]);
        }
      } else {
        for (var k = 0; k < view.length; k++) {
          data.push(view[k]);
        }
      }
      dataSource.data(data);
    };

    dataSource.page(1);
    new InfiniteScroll(gridContent, {
      callback: function (fireSequence, scrollDirection, delayFire) {
        data = dataSource.data();
        if ((Math.ceil(kendoOptions.totalRows / kendoOptions.pageSize) >= dataSource.page() + 1) && scrollDirection === 'next') {
          if (!kendoOptions.isGrouped) {
            _dataSourceQuery({
              page: dataSource.page() + 1,
              pageSize: kendoOptions.pageSize
            }, _normalDataAppend, delayFire);
          } else {
            _dataSourceQuery({
              page: dataSource.page() + 1,
              pageSize: kendoOptions.pageSize,
              group: {field: kendoOptions.groupField}
            }, _groupedDataAppend, delayFire)
          }
        }
      }
    }).run();
  }
  return false;
};


module.exports = kendoGridVS;

