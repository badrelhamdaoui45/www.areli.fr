(function($) {
  var Mobile,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.in_Menu_Mobile = Mobile = (function() {
    function Mobile(_at_args) {
      var els;
      this.args = _at_args;
      this.back = __bind(this.back, this);
      in_.extend(this, this.args);
      this.$root = $(":root");
      els = this._create(this.els, this.wrapper);
      if (this.transition == null) {
        this.transition = 500;
      }
      this.$view = els.view;
      this.$source = els.source;
      this.$parent = $(this.target);
      this._parse(this.$view, this.backLabel)._insert(this.$view, this.target, this.method).enable(true).on();
      this.$view.find('.active').removeClass('active');
      this.idle = true;
      this.goTo(this._getCurrent(this.$view));
      return this;
    }

    Mobile.prototype.onResize = function() {
      return this._onResize(this.range);
    };

    Mobile.prototype.isInRange = function() {
      return this._isInrange(this.range);
    };

    Mobile.prototype.insert = function() {
      return this._insert(this.$view, this.target, this.method);
    };

    Mobile.prototype.remove = function() {
      return this._remove(this.$view);
    };

    Mobile.prototype.goTo = function($target) {
      var delay, level;
      if (this.idle) {
        this.idle = false;
        level = $target.attr('data-level');
        delay = true;
        if (level != null) {
          this.$view.find('.level-active').delay(this.transition).queue(function() {
            $(this).not($target).not($target.parentsUntil(this.$view, 'ul')).removeClass('level-active');
            return $(this).dequeue();
          });
          this.$view.attr('data-level', level).find('.level-current').delay(this.transition).queue(function() {
            $(this).not($target).removeClass('level-current');
            return $(this).dequeue();
          });
          $target.addClass('level-current level-active').parentsUntil(this.$view, 'ul').addClass('level-active');
          this.flip(level);
          setTimeout((function(_this) {
            return function() {
              return _this.idle = true;
            };
          })(this), this.transition);
        } else {
          this.idle = true;
          this.goTo(this.$levels.first());
        }
      }
      return this;
    };

    Mobile.prototype.back = function() {
      this.goTo(this.$view.find('.level-current').parent().closest('ul'));
      return this;
    };

    Mobile.prototype.flip = function(page) {
      if (!page) {
        page = this.$view.attr('data-level');
      }
      this.$view.css('left', -this.parentWidth * page);
      return this;
    };

    Mobile.prototype.show = function() {
      this.$root.addClass('side-panel-open').removeClass('side-panel-close');
      return this;
    };

    Mobile.prototype.hide = function() {
      this.$root.addClass('side-panel-close').removeClass('side-panel-open');
      return this;
    };

    Mobile.prototype.toggle = function() {
      this.$root.toggleClass('side-panel-close').toggleClass('side-panel-open');
      return this;
    };

    Mobile.prototype.enable = function(force) {
      if (!this.isActive || force) {
        this.isActive = true;
        this.$source.hide();
        this._insert(this.$view, this.target, this.method)._bind(this.$view);
      }
      return this;
    };

    Mobile.prototype.disable = function(force) {
      if (this.isActive || force) {
        this.isActive = false;
        this.$source.show();
        this.hide()._unbind(this.$view)._remove(this.$view);
      }
      return this;
    };

    Mobile.prototype.on = function() {
      this._onResize(this.range);
      $(window).on("resize", in_.throttle((function(_this) {
        return function() {
          return _this._onResize(_this.range);
        };
      })(this), 500, {
        leading: false
      }));
      return this;
    };

    Mobile.prototype.off = function() {
      this.disable();
      $(window).off("resize");
      return this;
    };

    Mobile.prototype.resize = function(parentWidth) {
      this.$view.width(parentWidth * this.depth);
      this.$levels.css({
        width: parentWidth,
        left: parentWidth
      });
      this.parentWidth = parentWidth;
      this.flip();
      return this;
    };

    Mobile.prototype._onResize = function(range) {
      if (this._isInRange(range, $(window).width())) {
        this.resize(this.$parent.width()).enable();
      } else {
        this.disable();
      }
      return this;
    };

    Mobile.prototype._isInRange = function(range, windowWidth) {
      if ((!range[1] && range[0] <= windowWidth) || (range[0] <= windowWidth && windowWidth <= range[1])) {
        return true;
      } else {
        return false;
      }
    };

    Mobile.prototype._create = function(els, wrapper) {
      return {
        view: in_.suffixAttr($(wrapper).html(in_.concat(els)), "-mobile", ['id', 'class'], ['active', 'enabled', 'disable', 'current', 'nav']),
        source: $(els.join(","))
      };
    };

    Mobile.prototype._getCurrent = function($view) {
      var $current;
      $current = $view.find('.current');
      if ($current.hasClass('has-child')) {
        return $current.children('ul');
      } else {
        return $current.closest('ul');
      }
    };

    Mobile.prototype._parse = function($view, backLabel) {
      var depth;
      depth = 0;
      this.$levels = $view.find('ul').each(function(index, el) {
        var $el, level;
        $el = $(el);
        level = $el.parents('ul').length;
        $el.addClass('level');
        $el.attr({
          'data-level': level
        });
        return depth = Math.max(depth, level + 1);
      });
      this.depth = depth;
      $view.find('li').each(function(index, el) {
        var $child, $el, $title;
        $el = $(el);
        $child = $el.children('ul');
        if ($child.length) {
          $el.data('child', $child);
          $el.addClass('has-child');
          $title = $el.children('a');
          return $child.prepend($('<li class="level-title" />').html($title.clone())).prepend($('<li class="level-back" />').html(backLabel));
        }
      });
      this.$back = $view.find('.level-back');
      return this;
    };

    Mobile.prototype._insert = function($el, target, method) {
      switch (method) {
        case 'after':
          $(target).after($el);
          break;
        default:
          $(target).append($el);
      }
      return this;
    };

    Mobile.prototype._remove = function($el) {
      $el.remove();
      return this;
    };

    Mobile.prototype._bind = function($view) {
      $view.css("transition", this.transition + "ms left");
      $view.on('click', (function(_this) {
        return function(e) {
          var $target;
          e.stopPropagation();
          $target = $(e.target).not('ul').closest('li');
          if ($target.hasClass('has-child')) {
            e.preventDefault();
            return _this.goTo($target.children('ul'));
          }
        };
      })(this));
      this.$back.on('click', (function(_this) {
        return function() {
          return _this.back();
        };
      })(this));
      return this;
    };

    Mobile.prototype._unbind = function($view) {
      $view.off('click');
      this.$back.off('click');
      return this;
    };

    return Mobile;

  })();

  if (typeof module !== "undefined" && module !== null) {
    module.exports = in_Menu_Mobile;
  }

})(jQuery);

//# sourceMappingURL=managers/menu.Mobile.js.map
