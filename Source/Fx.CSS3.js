/*
---
name: Fx.CSS3
script: Fx.CSS3.js
license: MIT-style license.
description: Provides the CSS3 implementations of Tween, Morph and Elements
copyright: Copyright (c) 2010, Dipl.-Ing. (FH) André Fiedler <kontakt at visualdrugs dot net>, based on code by eskimoblood (mootools users group)
copyright: Copyright (c) 2011 Fred Cox mcfedr@gmail.com
authors: [Fred Cox, André Fiedler, eskimoblood]

requires: [Core/Class.Extras, Core/Element.Event, Core/Element.Style, Core/Fx, Core/Fx.Tween, Core/Fx.Morph, More/Array.Extras, More/Fx.Elements]

provides: [Fx.Tween.CSS3, Fx.Morph.CSS3, Fx.Elements.CSS3]
...
*/

(function() {
	
	Object.extend({

		isEqual: function(a, b){
			// Check object identity.
			if (a === b) return true;
			// Different types?
			var atype = typeOf(a), btype = typeOf(b);
			if (atype != btype) return false;
			// Basic equality test (watch out for coercions).
			if (a == b) return true;
			// One is falsy and the other truthy.
			if ((!a && b) || (a && !b)) return false;
			// One of them implements an isEqual()?
			if (a.isEqual) return a.isEqual(b);
			if (b.isEqual) return b.isEqual(a);
			// Both are NaN?
			if ((a !== a) && (b !== b)) return false;
			// Check dates' integer values.
			if (atype == 'date') return a.getTime() === b.getTime();
			if (atype == 'function') return true;
			// Compare regular expressions.
			if (atype == 'regexp')
			  return a.source     === b.source &&
			         a.global     === b.global &&
			         a.ignoreCase === b.ignoreCase &&
			         a.multiline  === b.multiline;
			// If a is not an object by this point, we can't handle it.
			if (atype !== 'object' && atype !== 'array') return false;
			// Check for different array lengths before comparing contents.
			if (a.length && (a.length !== b.length)) return false;
			// Nothing else worked, deep compare the contents.
			var aKeys = Object.keys(a), bKeys = Object.keys(b);
			// Different object sizes?
			if (aKeys.length != bKeys.length) return false;
			// Recursive comparison of contents.
			for (var key in a) if (!(key in b) || !Object.isEqual(a[key], b[key])) return false;
			return true;
		}

	});
	
	var css3Features = (function(){

		var prefix = (function(){
			var prefixes = ['ms', 'O', 'Moz', 'webkit'],
				style = document.documentElement.style;
			for (var l = prefixes.length; l--;){
				var prefix = prefixes[l];
				if (typeof style[prefix + 'Transition'] != 'undefined') return prefix;
			}
			return false;
		})();
		
		if(prefix) {
			return {
				transition: prefix + 'Transition',
				transitionProperty: prefix + 'TransitionProperty',
				transitionDuration: prefix + 'TransitionDuration',
				transitionTimingFunction : prefix + 'TransitionTimingFunction',
				transitionend: prefix == 'Moz' ? 'transitionend' : (prefix == 'ms' ? 'MS' : prefix) + 'TransitionEnd'
			}
		}
		return false;
	})();
	
	Element.NativeEvents[css3Features.transitionend] = 2;
	
	(window.DOMEvent||window.Event).implement({
		getPropertyName: function(){
			return this.event.propertyName;
		},

		getElapsedTime: function(nativeTime){
			return nativeTime ? this.event.elapsedTime : (this.event.elapsedTime * 1000).toInt();
		}
	});

	Array.implement({
		containsArray: function(array) {
			return array.every(function(v) {
				return this.contains(v);
			}, this);
		}
	});

	var transitionTimings = {
		'linear'		: '0,0,1,1',
		'expo:in'		: '0.71,0.01,0.83,0',
		'expo:out'		: '0.14,1,0.32,0.99',
		'expo:in:out'	: '0.85,0,0.15,1',
		'circ:in'		: '0.34,0,0.96,0.23',
		'circ:out'		: '0,0.5,0.37,0.98',
		'circ:in:out'	: '0.88,0.1,0.12,0.9',
		'sine:in'		: '0.22,0.04,0.36,0',
		'sine:out'		: '0.04,0,0.5,1',
		'sine:in:out'	: '0.37,0.01,0.63,1',
		'quad:in'		: '0.14,0.01,0.49,0',
		'quad:out'		: '0.01,0,0.43,1',
		'quad:in:out'	: '0.47,0.04,0.53,0.96',
		'cubic:in'		: '0.35,0,0.65,0',
		'cubic:out'		: '0.09,0.25,0.24,1',
		'cubic:in:out'	: '0.66,0,0.34,1',
		'quart:in'		: '0.69,0,0.76,0.17',
		'quart:out'		: '0.26,0.96,0.44,1',
		'quart:in:out'	: '0.76,0,0.24,1',
		'quint:in'		: '0.64,0,0.78,0',
		'quint:out'		: '0.22,1,0.35,1',
		'quint:in:out'	: '0.9,0,0.1,1'
	};

	var animatable = ['background-color', 'border-bottom-width', 'border-left-width', 'border-right-width',
		'border-spacing', 'border-top-width', 'border-width', 'bottom', 'color', 'font-size', 'font-weight',
		'height', 'left', 'letter-spacing', 'line-height', 'margin-bottom', 'margin-left', 'margin-right',
		'margin-top', 'max-height', 'max-width', 'min-height', 'min-width', 'opacity', 'outline-color', 'outline-offset',
		'outline-width', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'right', 'text-indent', 
		'top', 'vertical-align', 'visibility', 'width', 'word-spacing', 'z-index'];

	/*
	This is a list of properties listed by w3c but that are currently largely unsupported
	http://www.w3.org/TR/css3-transitions/#animatable-properties-
	http://www.opera.com/docs/specs/presto29/css/transitions/
	
	var unsupported = ['background-image', 'background-position', 'border-bottom-color', 'border-color', 'border-left-color',
		'border-right-color', 'border-top-color', 'crop', 'grid-*', 'text-shadow', 'zoom']
	*/

	Fx.CSS3Funcs = {
		initialize: function(element, options){
			if(css3Features) {
				options = options || {};
				if(!options.transition || !transitionTimings[options.transition]) {
					options.transition = 'sine:in:out';
				}
				if(this.initializeCSS3) {
					this.initializeCSS3(element, options);
				}
			}
			this.parent(element, options);
		},
		
		startCSS3: function(properties, from, to) {
			if(!this.check()) return this;
			
			if(!Object.isEqual(from, to)) {
				this.preTransStyles = this.element.getStyles(Fx.CSS3Funcs.css3Features.transitionProperty,
					Fx.CSS3Funcs.css3Features.transitionDuration,
					Fx.CSS3Funcs.css3Features.transitionTimingFunction);
				
				var incomplete = {};
				properties.each(function(p) {
					incomplete[p] = false;
				});
				
				this.animatingProperties = properties;
				
				this.boundComplete = function(e) {
					incomplete[e.getPropertyName()] = true;
					if(Object.every(incomplete, function(v) { return v; })) {
						this.element.removeEvent(Fx.CSS3Funcs.css3Features.transitionend, this.boundComplete);
						this.element.setStyles(this.preTransStyles);
						this.boundComplete = null;
						this.fireEvent('complete', this.subject);
						if (!this.callChain()) this.fireEvent('chainComplete', this.subject);
					}
				}.bind(this);

				this.element.addEvent(Fx.CSS3Funcs.css3Features.transitionend, this.boundComplete);
				
				var trans = function(){
					var transStyles = {};
					transStyles[Fx.CSS3Funcs.css3Features.transitionProperty] =
						properties.reduce(function(a, b) { return a + ', '  + b; });
					transStyles[Fx.CSS3Funcs.css3Features.transitionDuration] = this.options.duration + 'ms';
					transStyles[Fx.CSS3Funcs.css3Features.transitionTimingFunction] = 
						'cubic-bezier(' + Fx.CSS3Funcs.transitionTimings[this.options.transition] + ')';
					this.element.setStyles(transStyles);
					this.set(this.compute(from, to, 1));
				}.bind(this);
				
				this.element.setStyle(Fx.CSS3Funcs.css3Features.transitionProperty, 'none');
				this.set(this.compute(from, to, 0));
				trans.delay(0.1);
				this.fireEvent('start', this.subject);
			}
			else {
				this.fireEvent('start', this.subject);
				this.fireEvent('complete', this.subject);
			}
			return this;
		},

		pause: function() {
			if (this.css3Supported){
				return this;
			}
			return this.parent();
		},

		resume: function() {
			if (this.css3Supported){
				return this;
			}
			return this.parent();
		},

		isRunning: function() {
			if (this.css3Supported){
				return !!this.boundComplete;
			}
			return this.parent();
		}
	};
	
	Fx.CSS3Funcs.css3Features = css3Features;
	Fx.CSS3Funcs.transitionTimings = transitionTimings;
	Fx.CSS3Funcs.animatable = animatable;
	
	Fx.CSS3Stop = {
		cancel: function(){
			if (this.css3Supported){
				if(this.isRunning()) {
					this.element.removeEvent(Fx.CSS3Funcs.css3Features.transitionend, this.boundComplete);
					this.element.setStyles(this.preTransStyles);
					this.boundComplete = null;
					this.fireEvent('cancel', this.subject);
					this.clearChain();
				}
				return this;
			}
			return this.parent();
		},

		stop: function() {
			if (this.css3Supported){
				if(this.isRunning()) {
					this.element.removeEvent(Fx.CSS3Funcs.css3Features.transitionend, this.boundComplete);
					this.element.setStyles(this.preTransStyles);
					this.boundComplete = null;
					this.fireEvent('complete', this.subject);
					if (!this.callChain()) this.fireEvent('chainComplete', this.subject);
				}
				return this;
			}
			return this.parent();
		}
	};

})();

(function() {
	
	var tweenCSS2 = Fx.Tween;
	var tweenCSS3;

	tweenCSS3 = new Class({

		Extends: tweenCSS2,

		checkCSS3: function(property){
			return (Fx.CSS3Funcs.css3Features && Fx.CSS3Funcs.animatable.contains(property));
		},

		start: function(property, from, to){
			var args = Array.flatten(arguments);
			this.property = this.options.property || args.shift();
			if ((this.css3Supported = this.checkCSS3(this.property))) {
				var parsed = this.prepare(this.element, this.property, args);
				return this.startCSS3([this.property], parsed.from, parsed.to);
			}
			return this.parent(property, from, to);
		}
	});

	tweenCSS3.implement(Fx.CSS3Funcs);
	tweenCSS3.implement(Fx.CSS3Stop);

	Fx.Tween.CSS2 = tweenCSS2;
	Fx.Tween.CSS3 = tweenCSS3;
	
})();


(function() {
	
	var morphCSS2 = Fx.Morph;
	var morphCSS3;
	
	morphCSS3 = new Class({

		Extends: morphCSS2,

		checkCSS3: function(properties){
			return (Fx.CSS3Funcs.css3Features && Fx.CSS3Funcs.animatable.containsArray(Object.keys(properties)));
		},
		
		start: function(properties){
			if ((this.css3Supported = this.checkCSS3(properties))) {
				if (typeof properties == 'string') properties = this.search(properties);
				var from = {}, to = {}, usedProps = [];
				for (var p in properties){
					var parsed = this.prepare(this.element, p, properties[p]);
					if(!Object.isEqual(parsed.from, parsed.to)) {
						from[p] = parsed.from;
						to[p] = parsed.to;
						usedProps.push(p);
					}
				}
				return this.startCSS3(usedProps, from, to);
			}
			return this.parent(properties);
		}
	});

	morphCSS3.implement(Fx.CSS3Funcs);
	morphCSS3.implement(Fx.CSS3Stop);

	Fx.Morph.CSS2 = morphCSS2;
	Fx.Morph.CSS3 = morphCSS3;
})();

(function() {
	
	if(Fx.Elements) {
	
		var elementsCSS2 = Fx.Elements;
		var elementsCSS3;

		elementsCSS3 = new Class({
			Extends: elementsCSS2,
		
			initializeCSS3: function(elements, options){
				this.morphers = elements.map(function(element) {
					return new Fx.Morph(element, Object.merge({}, options, {
						onComplete: this._complete.bind(this),
						onCancel: this._cancel.bind(this)
					}));
				}.bind(this));
			},
		
			_complete: function() {
				if(--this.count == 0) {
					this.fireEvent('complete', this.subject);
					if (!this.callChain()) this.fireEvent('chainComplete', this.subject);
				}
			},
		
			_cancel: function() {
				if(--this.count == 0) {
					this.fireEvent('cancel', this.subject);
					this.clearChain();
				}
			},

			checkCSS3: function(obj){
				return (Fx.CSS3Funcs.css3Features && Object.every(obj, function(properties, key) {
					if(properties && this.elements[key]) {
						return Fx.CSS3Funcs.animatable.containsArray(Object.keys(properties));
					}
					return true;
				}, this));
			},
		
			count: 0,

			start: function(obj){
				if ((this.css3Supported = this.checkCSS3(obj))) {
					if(!this.check()) return this;
					this.count = 0;

					Object.each(obj, function(properties, key) {
						if(properties && this.elements[key]) {
							this.count++;
							this.morphers[key].start(properties);
						}
					}, this);

					this.fireEvent('start', this);
					return this;
				}
				return this.parent(obj);
			},
		
			stop: function() {
				if(this.css3Supported) {
					Object.each(this.morphers, function(morph) {
						morph.stop();
					});
					return this;
				}
				return this.parent();
			},
		
			cancel: function() {
				if(this.css3Supported) {
					Object.each(this.morphers, function(morph) {
						morph.cancel();
					});
					return this;
				}
				return this.parent();
			},
		
			isRunning: function() {
				if(this.css3Supported) {
					return this.count != 0;
				}
				return this.parent();
			}
		});

		elementsCSS3.implement(Fx.CSS3Funcs);

		Fx.Elements.CSS2 = elementsCSS2;
		Fx.Elements.CSS3 = elementsCSS3;
	
	}

})();

/**
 * 'tweenCSS3' and 'morphCSS3' properties
 */
(function() {
	Element.Properties.tweenCSS3 = {
		set: function(options){
			this.get('tweenCSS3').cancel().setOptions(options);
			return this;
		},
		get: function(){
			var tween = this.retrieve('tweenCSS3');
			if (!tween){
				tween = new Fx.Tween.CSS3(this, {link: 'cancel'});
				this.store('tweenCSS3', tween);
			}
			return tween;
		}
	};

	Element.Properties.morphCSS3 = {
		set: function(options){
			this.get('morphCSS3').cancel().setOptions(options);
			return this;
		},
		get: function(){
			var morph = this.retrieve('morphCSS3');
			if (!morph){
				morph = new Fx.Morph.CSS3(this, {link: 'cancel'});
				this.store('morphCSS3', morph);
			}
			return morph;
		}

	};
	Element.implement({
		tweenCSS3: function(property, from, to){
			this.get('tweenCSS3').start(property, from, to);
			return this;
		},
		morphCSS3: function(props){
			this.get('morphCSS3').start(props);
			return this;
		}
	});
})();