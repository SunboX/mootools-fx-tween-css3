Fx.Tween.CSS3
============

Mimics the Fx.Tween behavior but tries to use native CSS3 transition if possible.
Like the Fx.Tween effect, Fx.Tween.CSS3 is used to transition any CSS property from one value to another.


### Demo:

You can see a simple online demo in [this shell](http://jsfiddle.net/SunboX/qTnfb/)


### Options, Events:

See: [FX.Tween](http://mootools.net/docs/core/Fx/Fx.Tween)


### Notes:

Only short notated transitions are supported as option.transition by Fx.Tween.CSS3.
Like:

	new Fx.Tween.CSS3('myElementID', {
		
		transition: 'sine:in'
		
	});



How to use
---------------------


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
---

See [license](http://github.com/SunboX/mootools-fx-tween-css3/blob/master/license) file.