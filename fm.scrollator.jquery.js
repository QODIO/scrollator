/*
 Scrollator jQuery Plugin
 Scrollator is a jQuery-based replacement for the browsers scroll bar, which doesn't use any space.
 version 1.2, June 1st, 2015
 by Ingi P. Jacobsen

 The MIT License (MIT)

 Copyright (c) 2014 Faroe Media

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

Scrollator = {
	scrollatorElementsStack: [],
	refreshAll: function () {
		var i = Scrollator.scrollatorElementsStack.length;
		while (i--) {
			if (!Scrollator.scrollatorElementsStack[i].$sourceElement.closest('body').length > 0) {
				Scrollator.scrollatorElementsStack[i].destroy();
			} else {
				Scrollator.scrollatorElementsStack[i].refresh();
			}
		}
	}
};
$(window).load(function () {
	Scrollator.refreshAll();
});
(function($) {
	$.scrollator = function (sourceElement, options) {
		var defaults = {
			custom_class: '',
			prevent_propagation: false,
			zIndex: ''
		};
		var plugin = this;
		plugin.settings = {};
		var $html = $('html');
		var $sourceElement = $(sourceElement);
		plugin.$sourceElement = $sourceElement;
		var $mainScrollatorHolder = null;
		var $thisScrollatorLaneHolder = null;
		var $thisScrollatorLane = null;
		var $thisScrollatorHandleHolder = null;
		var $thisScrollatorHandle = null;
		var timerVisibility = null;
		var isDraggingHandle = false;
		var dragStartY = 0;
		var dragStartScrollTop = 0;
		var dragHandleOffsetY = 0;
		

		// INITIALIZE PLUGIN
		plugin.init = function () {
			plugin.settings = $.extend({}, defaults, options);
			$mainScrollatorHolder = $('#scrollator_holder');
			$sourceElement.addClass('scrollator');
			// initialize scrollator lane holder
			$thisScrollatorLaneHolder = $(document.createElement('div')).addClass('scrollator_lane_holder');
			$thisScrollatorLaneHolder.addClass(plugin.settings.custom_class);
			$thisScrollatorLaneHolder.css('z-index', $sourceElement.css('z-index'));
			plugin.settings.zIndex !== '' && $thisScrollatorLaneHolder.css('z-index', plugin.settings.zIndex);
			$sourceElement.is('body') && $thisScrollatorLaneHolder.addClass('scrollator_on_body');
			// initialize scrollator lane
			$thisScrollatorLane = $(document.createElement('div')).addClass('scrollator_lane');
			// initialize scrollator handle holder
			$thisScrollatorHandleHolder = $(document.createElement('div')).addClass('scrollator_handle_holder');
			// initialize scrollator handle
			$thisScrollatorHandle = $(document.createElement('div')).addClass('scrollator_handle');
			initializeMainScrollatorsHolder();
			if ($sourceElement.prop('tagName') == 'BODY') {
				$html.bind('mousewheel DOMMouseScroll', mouseWheelEvent);
				$html.bind('mousemove', mouseMoveEvent);
			} else {
				$sourceElement.bind('mousewheel DOMMouseScroll', mouseWheelEvent);
				$sourceElement.bind('mousemove', mouseMoveEvent);
			}
			$thisScrollatorLaneHolder.bind('mousewheel DOMMouseScroll', mouseWheelEvent);
			$thisScrollatorLane.bind('mousewheel DOMMouseScroll', mouseWheelEvent);
			$thisScrollatorHandleHolder.bind('mousewheel DOMMouseScroll', mouseWheelEvent);
			$thisScrollatorHandle.bind('mousewheel DOMMouseScroll', mouseWheelEvent);
			$thisScrollatorLaneHolder.bind('mousemove', mouseMoveEvent);
			$thisScrollatorLane.bind('mousemove', mouseMoveEvent);
			$thisScrollatorHandleHolder.bind('mousemove', mouseMoveEvent);
			$thisScrollatorHandle.bind('mousemove', mouseMoveEvent);
			$thisScrollatorHandleHolder.bind('mousedown', mouseDownEvent);
			$thisScrollatorHandle.bind('mousedown', mouseDownEvent);
			$(window).bind('mouseup', windowMouseUpEvent);
			$(window).bind('mousemove', windowMouseMoveEvent);
			$(window).bind('keydown', windowKeyDownEvent);
			$thisScrollatorHandleHolder.append($thisScrollatorHandle);
			$thisScrollatorLane.append($thisScrollatorHandleHolder);
			$thisScrollatorLaneHolder.append($thisScrollatorLane);
			$mainScrollatorHolder.append($thisScrollatorLaneHolder);
			refreshScrollatorPosition();
			// refresh/resize/position all scrollators on window resize
			if (!document.body.hasScrollatorPageResizeEventHandler) {
				document.body.hasScrollatorPageResizeEventHandler = true;
				$(window).bind('resize', function () {
					Scrollator.refreshAll();
				});
			}
			mouseMoveEvent();
		};


		var mouseWheelEvent = function (e) {
			if (!e.ctrlKey) {
				if ($(e.target).css('overflow-y') != 'auto' || $(e.target).css('position') == 'fixed' || $(e.target).prop('tagName') == 'PRE') {
					var scrollTop = ($sourceElement.is('body') ? $(window) : $sourceElement).scrollTop();
					var scrollTopBefore = scrollTop;
					var scrollAdjust = 0;
					if (e.originalEvent.wheelDeltaY !== undefined && e.originalEvent.wheelDeltaY !== 0) { // Chrome
						scrollAdjust = e.originalEvent.wheelDeltaY / 1.2;
					} else if (e.originalEvent.wheelDelta !== undefined && e.originalEvent.wheelDelta !== 0) { // IE, Opera
						scrollAdjust = e.originalEvent.wheelDelta / 1.2;
					} else if (e.originalEvent.detail !== undefined && e.originalEvent.detail !== 0) { // Firefox
						scrollAdjust = e.originalEvent.detail * -33.33;
					}
					scrollTop += scrollAdjust*-1;
					($sourceElement.is('body') ? $(window) : $sourceElement).scrollTop(scrollTop);
					scrollTop = ($sourceElement.is('body') ? $(window) : $sourceElement).scrollTop();
					Scrollator.refreshAll();

					if (scrollTopBefore != scrollTop || plugin.settings.prevent_propagation) {
						e.preventDefault();
						e.stopPropagation();
					}
				}
			}
		};
		var mouseMoveEvent = function () {
			clearTimeout(timerVisibility);
			if ($sourceElement[0].scrollHeight > ($sourceElement.is('body') ? $(window).height() : $sourceElement.innerHeight())) {
				$thisScrollatorLaneHolder.css('opacity', 1);
				timerVisibility = setTimeout(function () {
					$thisScrollatorLaneHolder.css('opacity', 0);
				}, 1500);
			} else {
				$thisScrollatorLaneHolder.css('opacity', 0);
			}
		};
		var mouseDownEvent = function (e) {
			e.preventDefault();
			isDraggingHandle = true;
			dragStartY = e.clientY;
			dragStartScrollTop = ($sourceElement.is('body') ? $(window) : $sourceElement).scrollTop();
			dragHandleOffsetY = e.offsetY;
			$thisScrollatorLaneHolder.addClass('hover');
		};
		var windowMouseMoveEvent = function (e) {
			if (isDraggingHandle) {
				var draggedY = e.clientY - dragStartY;
				var multiplier = $sourceElement[0].scrollHeight / ($sourceElement.is('body') ? $(window).height() : $sourceElement.innerHeight());
				($sourceElement.is('body') ? $(window) : $sourceElement).scrollTop(dragStartScrollTop + (draggedY * multiplier));
				Scrollator.refreshAll();
				mouseMoveEvent();
			}
		};
		var windowMouseUpEvent = function () {
			isDraggingHandle = false;
			$thisScrollatorLaneHolder.removeClass('hover');
		};
		var windowKeyDownEvent = function (e) {
			var key = {
				pageUp: 33,
				pageDown: 34
			};
			if ((e.keyCode == key.pageUp || e.keyCode == key.pageDown) && $(document.activeElement).prop('tagName') != 'TEXTAREA') {
				var scrollTop = ($sourceElement.is('body') ? $(window) : $sourceElement).scrollTop();
				var scrollAdjust = ($sourceElement.is('body') ? $(window).height() : $sourceElement.innerHeight()) * 0.9;
				if (e.keyCode == key.pageUp) {
					scrollTop -= scrollAdjust;
				} else if (e.keyCode == key.pageDown) {
					scrollTop += scrollAdjust;
				}
				($sourceElement.is('body') ? $(window) : $sourceElement).scrollTop(scrollTop);
				Scrollator.refreshAll();
				mouseMoveEvent();
			}
		};
	

		plugin.refresh = function () {
			refreshScrollatorPosition();
		};
		var refreshScrollatorPosition = function () {
			var boundingClientRect = $sourceElement[0].getBoundingClientRect();
			var sourceBounds = {
				left:   boundingClientRect.left + $(window).scrollLeft(),
				top:    boundingClientRect.top + $(window).scrollTop(),
				right:  boundingClientRect.right + $(window).scrollLeft(),
				bottom: boundingClientRect.bottom + $(window).scrollTop(),
				width:  boundingClientRect.width,
				height: boundingClientRect.height
			};
			var paddingTop = parseInt($sourceElement.css('border-top-width'), 10);
			var paddingRight = parseInt($sourceElement.css('border-right-width'), 10);
			var paddingBottom = parseInt($sourceElement.css('border-bottom-width'), 10);
			var paddingLeft = parseInt($sourceElement.css('border-left-width'), 10);
			var contentHeight = $sourceElement[0].scrollHeight;
			var laneHeight = ($sourceElement.is('body')) ? $(window).height() : $sourceElement.innerHeight();
			var handleHeight = (laneHeight / contentHeight) * 100;
			var handlePosition = (($sourceElement.is('body') ? $(window) : $sourceElement).scrollTop() / contentHeight) * 100;
			if (!$sourceElement.is('body')) {
				$thisScrollatorLaneHolder.css({
					top: sourceBounds.top + paddingTop,
					right: -sourceBounds.right + paddingRight,
					bottom: -sourceBounds.bottom + paddingBottom
				});
			}
			$thisScrollatorHandleHolder.css({
				height: handleHeight + '%',
				top: handlePosition + '%'
			});
		};


		// INITIALIZE SCROLLATORS HOLDER IF NEEDED
		var initializeMainScrollatorsHolder = function () {
			if ($mainScrollatorHolder.length === 0) {
				$mainScrollatorHolder = $(document.createElement('div')).attr('id', 'scrollator_holder');
				$('body').append($mainScrollatorHolder);
			}
		};
		
		
		// HIDE SCROLLATOR
		plugin.hide = function () {
			$thisScrollatorLaneHolder.hide();
		};
		
		// SHOW SCROLLATOR
		plugin.show = function () {
			$thisScrollatorLaneHolder.show();
		};


		// REMOVE PLUGIN AND REVERT INPUT ELEMENT TO ORIGINAL STATE
		plugin.destroy = function () {
			$sourceElement.removeClass('scrollator');
			$.removeData(sourceElement, 'scrollator');
			if ($sourceElement.prop('tagName') == 'BODY') {
				$html.unbind('mousewheel DOMMouseScroll', mouseWheelEvent);
				$html.unbind('mousemove', mouseMoveEvent);
			} else {
				$sourceElement.unbind('mousewheel DOMMouseScroll', mouseWheelEvent);
				$sourceElement.unbind('mousemove', mouseMoveEvent);
			}
			$(window).unbind('mouseup', windowMouseUpEvent);
			$(window).unbind('mousemove', windowMouseMoveEvent);
			$(window).unbind('keydown', windowKeyDownEvent);
			$thisScrollatorLaneHolder.remove();
			var i = Scrollator.scrollatorElementsStack.length;
			while (i--) {
				if (Scrollator.scrollatorElementsStack[i] === plugin) {
					Scrollator.scrollatorElementsStack.splice(i, 1);
				}
			}
			if ($mainScrollatorHolder.children().length === 0) {
				$mainScrollatorHolder.remove();
				$mainScrollatorHolder = null;
			}
		};
		
		// Initialize plugin
		plugin.init();
	};

	$.fn.scrollator = function(options) {
		options = options !== undefined ? options : {};
		return this.each(function () {
			if ( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|ARM|Touch|Opera Mini/i.test(navigator.userAgent) ) {
				if (typeof(options) === 'object') {
					if (undefined === $(this).data('scrollator')) {
						var plugin = new $.scrollator(this, options);
						Scrollator.scrollatorElementsStack.push(plugin);
						$(this).data('scrollator', plugin);
					}
				} else if ($(this).data('scrollator')[options]) {
					$(this).data('scrollator')[options].apply(this, Array.prototype.slice.call(arguments, 1));
				} else {
					$.error('Method ' + options + ' does not exist in $.scrollator');
				}
			}
		});
	};

}(jQuery));
