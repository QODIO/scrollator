/*
 Scrollator jQuery Plugin
 Scrollator is a jQuery-based replacement for the browsers scroll bar, which doesn't use any space.
 version 1.0, July 3rd, 2014
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

(function($) {
	$.scrollator = function (sourceElement, options) {
		var defaults = {
		};

		var plugin = this;
		plugin.settings = {};
		var $sourceElement = $(sourceElement);
		var $mainScrollbarsHolder = null;
		var $thisScrollbarLane = null;
		var $thisScrollbarHandle = null;
		var timerVisibility = null;
		var isDraggingHandle = false;
		var dragStartY = 0;
		var dragStartScrollTop = 0;
		var dragHandleOffsetY = 0;
		

		// INITIALIZE PLUGIN
		plugin.init = function () {
			plugin.settings = $.extend({}, defaults, options);
			$mainScrollbarsHolder = $('#scrollator_holder');
			$sourceElement.addClass('scrollator');
			$thisScrollbarLane = $(document.createElement('div')).addClass('scrollator_lane');
			if ($sourceElement.is('body')) {
				$thisScrollbarLane.addClass('scrollator_body_lane');
			}
			$thisScrollbarHandle = $(document.createElement('div')).addClass('scrollator_handle');
			initializeMainScrollbarsHolder();
			$sourceElement.bind('mousewheel DOMMouseScroll', function (e) {
				e.preventDefault();
				e.stopPropagation();
				mouseWheelEvent(e);
			});
			$thisScrollbarLane.bind('mousewheel DOMMouseScroll', function (e) {
				e.preventDefault();
				e.stopPropagation();
				mouseWheelEvent(e);
			});
			$thisScrollbarHandle.bind('mousewheel DOMMouseScroll', function (e) {
				e.preventDefault();
				e.stopPropagation();
				mouseWheelEvent(e);
			});
			$sourceElement.bind('mousemove', function () {
				mouseMoveEvent();
			});
			$thisScrollbarLane.bind('mousemove', function () {
				mouseMoveEvent();
			});
			$thisScrollbarHandle.bind('mousemove', function () {
				mouseMoveEvent();
			});
			$thisScrollbarHandle.bind('mousedown', function (e) {
				e.preventDefault();
				isDraggingHandle = true;
				dragStartY = e.clientY;
				dragStartScrollTop = ($sourceElement.is('body') ? $(window) : $sourceElement).scrollTop();
				dragHandleOffsetY = e.offsetY;
			});
			$(window).bind('mouseup', function () {
				isDraggingHandle = false;
			});
			$(window).bind('mousemove', function (e) {
				if (isDraggingHandle) {
					var draggedY = e.clientY - dragStartY;
					var multiplier = $sourceElement[0].scrollHeight / (($sourceElement.is('body')) ? $(window).height() : $sourceElement.innerHeight());
					($sourceElement.is('body') ? $(window) : $sourceElement).scrollTop(dragStartScrollTop + (draggedY * multiplier));
					refreshScrollbarPosition();
					mouseMoveEvent();
				}
			});
			$thisScrollbarLane.append($thisScrollbarHandle);
			$mainScrollbarsHolder.append($thisScrollbarLane);
			refreshScrollbarPosition();
		};


		var mouseWheelEvent = function (e) {
			var scrollTop = ($sourceElement.is('body') ? $(window) : $sourceElement).scrollTop();
			var wheelDelta = e.originalEvent.wheelDelta !== undefined ? e.originalEvent.wheelDelta : (e.originalEvent.detail*-1);
			scrollTop += (wheelDelta > 0) ? -100 : 100;
			($sourceElement.is('body') ? $(window) : $sourceElement).scrollTop(scrollTop);
			refreshScrollbarPosition();
		};


		var mouseMoveEvent = function () {
			clearTimeout(timerVisibility);
			$thisScrollbarLane.css('opacity', 1);
			timerVisibility = setTimeout(function () {
				$thisScrollbarLane.css('opacity', 0);
			}, 1500);
		};
	
		
		var refreshScrollbarPosition = function () {
			var boundingClientRect = $sourceElement[0].getBoundingClientRect();
			var sourceBounds = {
				left:   boundingClientRect.left + $(window).scrollLeft(),
				top:    boundingClientRect.top + $(window).scrollTop(),
				right:  boundingClientRect.right + $(window).scrollLeft(),
				bottom: boundingClientRect.bottom + $(window).scrollTop(),
				width:  boundingClientRect.width,
				height: boundingClientRect.height
			};
			var paddingTop = parseInt($sourceElement.css('border-top-width'), 10) + 3;
			var paddingRight = parseInt($sourceElement.css('border-right-width'), 10) + 3;
			var paddingBottom = parseInt($sourceElement.css('border-bottom-width'), 10) + 3;
			var paddingLeft = parseInt($sourceElement.css('border-left-width'), 10);
			var contentHeight = $sourceElement[0].scrollHeight;
			var laneHeight = ($sourceElement.is('body')) ? $(window).height() : $sourceElement.innerHeight();
			var handleHeight = (laneHeight / contentHeight) * 100;
			var handlePosition = (($sourceElement.is('body') ? $(window) : $sourceElement).scrollTop() / contentHeight) * 100;
			if (!$sourceElement.is('body')) {
				$thisScrollbarLane.css({
					top: sourceBounds.top + paddingTop,
					right: -sourceBounds.right + paddingRight,
					bottom: -sourceBounds.bottom + paddingBottom
				});
			}
			$thisScrollbarHandle.css({
				height: handleHeight + '%',
				top: handlePosition + '%'
			});
		};


		// INITIALIZE SCROLLBARS HOLDER IF NEEDED
		var initializeMainScrollbarsHolder = function () {
			if ($mainScrollbarsHolder.length === 0) {
				$mainScrollbarsHolder = $(document.createElement('div')).attr('id', 'scrollator_holder');
				$('body').append($mainScrollbarsHolder);
			}
		};


		// REMOVE PLUGIN AND REVERT INPUT ELEMENT TO ORIGINAL STATE
		plugin.destroy = function () {
			$sourceElement.removeClass('scrollator');
			$.removeData(sourceElement, 'scrollator');
			$sourceElement.unbind('mousewheel DOMMouseScroll');
			$thisScrollbarLane.remove();
			if ($mainScrollbarsHolder.children().length === 0) {
				$mainScrollbarsHolder.remove();
				$mainScrollbarsHolder = null;
			}
		};
		
		// Initialize plugin
		plugin.init();
	};

	$.fn.scrollator = function(options) {
		options = options !== undefined ? options : {};
		return this.each(function () {
			if (typeof(options) === 'object') {
				if (undefined === $(this).data('scrollator')) {
					var plugin = new $.scrollator(this, options);
					$(this).data('scrollator', plugin);
				}
			} else if ($(this).data('scrollator')[options]) {
				$(this).data('scrollator')[options].apply(this, Array.prototype.slice.call(arguments, 1));
			} else {
				$.error('Method ' + options + ' does not exist in $.scrollator');
			}
		});
	};

}(jQuery));
