Fx.Tween.CSS3
=========

Mimics the Fx.Tween behavior but tries to use native CSS3 transition if possible.
Like the Fx.Tween effect, Fx.Tween.CSS3 is used to transition any CSS property from one value to another.


![Screenshot](https://github.com/SunboX/mootools-fx-tween-css3/raw/master/screen.png)


Demos:
----------

- You can see a simple online demo in [this shell](http://jsfiddle.net/SunboX/TAVWa/84/)
- More complex demo: [SqueezeBox using Fx.Tween.CSS3](http://jsfiddle.net/SunboX/bmMCy/)


Options, Events:
----------

See: [FX.Tween](http://mootools.net/docs/core/Fx/Fx.Tween)


Notes:
----------

Only short notated transitions are supported as option.transition by Fx.Tween.CSS3.
Like:

	new Fx.Tween.CSS3('myElementID', {
		
		transition: 'sine:in'
		
	});


Performance:
----------

#### Tested on OSX 10.6:

- Safari 4: 30% faster than Fx.Tween
- Google Chrome 5: nearly equal compared to Fx.Tween
- Firefox 3.6.3: nearly equal compared to Fx.Tween
- Opera 10.53: nearly equal compared to Fx.Tween

#### Tested on iPhone 3GS:

- Mobile Safari: runns a lot faster (and smoother) than Fx.Tween (with default fps)

#### Tested on Windows 7:

- Safari 4: a lot faster than Fx.Tween (200 running instances of Fx.Tween hangs the browser, 200 Fx.Tween.CSS3 instances still working (40% CPU usage))
- Google Chrome 5: 50% faster than Fx.Tween
- Firefox 3.6.3: nearly equal compared to Fx.Tween
- Opera 10.53: nearly equal compared to Fx.Tween


How to use
----------


	window.addEvent('domready', function(){
		
	    var fx = new Fx.Tween.CSS3('myElementID', {
	        duration: 605,
	        transition: 'quint:in:out'
	    });
	
	    fx.addEvent('complete', function(){
	        alert('complete');
	    });
			
	    fx.start('height', 100, 300);
	
	});



License
----------

See [license](http://github.com/SunboX/mootools-fx-tween-css3/blob/master/license) file.