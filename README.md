Scrollator
=======
Scrollator is a jQuery-based replacement for the browsers scroll bar, which doesn't use any space. Has very good performance.
[You can see a demo here](http://opensource.faroemedia.com/scrollator).


Usage
-----
###### include in head:
```html
<script src="jquery-1.11.0.min.js"></script>
<script src="fm.scrollator.jquery.js"></script>
```

###### to activate replacement:
```javascript
$(document.body).scrollator();
```
or
```javascript
$('#scrollable_div').scrollator();
```


###### if you want to change settings:
```javascript
$('#scrollable_div').scrollator({
    custom_class: '',	// A class to be added to this scrollator lane
    zIndex: '',			// z-index to be added to the scrollator lane
});
```


Global methods
--------------
Method                 | Description
---------------------- | -----------
Scrollator.refreshAll  | Resize and reposition all scrollators


jQuery methods
--------------
Method             | Description
------------------ | -----------
destroy            | This method is used to remove the instance of the plugin from the element box
refresh            | Resize and reposition the scrollator
show               | Show the scrollator
hide               | Hide the scrollator


###### Method usage
```javascript
$('#scrollable_div').numbertor('destroy');
```


CSS classes
-----------
Here is a list of all the css classes

Class                     | Description
------------------------- | ------------------------------------------------------------------------------
#scrollator_holder        | The main scrollator holder has this id
scrollator                | This class is added to the scrollable elements which scrollator is added to
scrollator_lane_holder    | The scrollator lane holder
scrollator_lane           | The scrollator lane
scrollator_on_body        | This class is added to the scrollator lane, if it is the lane of a body element
scrollator_handle_holder  | The scrollator handle holder
scrollator_handle         | The scrollator handle


Browser compatibility
---------------------
* IE ?
* Chrome ?
* Firefox ?
* Safari ?
* Opera ?



Copyright and license
---------------------
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
