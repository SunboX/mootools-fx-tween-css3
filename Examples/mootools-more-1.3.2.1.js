// MooTools: the javascript framework.
// Load this file's selection again by visiting: http://mootools.net/more/cbf2909f532bfaecd87d1f6d8da99cb8 
// Or build this file again with packager using: packager build More/Fx.Accordion
/*
---
copyrights:
  - [MooTools](http://mootools.net)

licenses:
  - [MIT License](http://mootools.net/license.txt)
...
*/
MooTools.More={version:"1.3.2.1",build:"e586bcd2496e9b22acfde32e12f84d49ce09e59d"};Fx.Elements=new Class({Extends:Fx.CSS,initialize:function(b,a){this.elements=this.subject=$$(b);
this.parent(a);},compute:function(g,h,j){var c={};for(var d in g){var a=g[d],e=h[d],f=c[d]={};for(var b in a){f[b]=this.parent(a[b],e[b],j);}}return c;
},set:function(b){for(var c in b){if(!this.elements[c]){continue;}var a=b[c];for(var d in a){this.render(this.elements[c],d,a[d],this.options.unit);}}return this;
},start:function(c){if(!this.check(c)){return this;}var h={},j={};for(var d in c){if(!this.elements[d]){continue;}var f=c[d],a=h[d]={},g=j[d]={};for(var b in f){var e=this.prepare(this.elements[d],b,f[b]);
a[b]=e.from;g[b]=e.to;}}return this.parent(h,j);}});Fx.Accordion=new Class({Extends:Fx.Elements,options:{fixedHeight:false,fixedWidth:false,display:0,show:false,height:true,width:false,opacity:true,alwaysHide:false,trigger:"click",initialDisplayFx:true,resetHeight:true},initialize:function(){var g=function(h){return h!=null;
};var f=Array.link(arguments,{container:Type.isElement,options:Type.isObject,togglers:g,elements:g});this.parent(f.elements,f.options);var b=this.options,e=this.togglers=$$(f.togglers);
this.previous=-1;this.internalChain=new Chain();if(b.alwaysHide){this.options.link="chain";}if(b.show||this.options.show===0){b.display=false;this.previous=b.show;
}if(b.start){b.display=false;b.show=false;}var d=this.effects={};if(b.opacity){d.opacity="fullOpacity";}if(b.width){d.width=b.fixedWidth?"fullWidth":"offsetWidth";
}if(b.height){d.height=b.fixedHeight?"fullHeight":"scrollHeight";}for(var c=0,a=e.length;c<a;c++){this.addSection(e[c],this.elements[c]);}this.elements.each(function(j,h){if(b.show===h){this.fireEvent("active",[e[h],j]);
}else{for(var k in d){j.setStyle(k,0);}}},this);if(b.display||b.display===0||b.initialDisplayFx===false){this.display(b.display,b.initialDisplayFx);}if(b.fixedHeight!==false){b.resetHeight=false;
}this.addEvent("complete",this.internalChain.callChain.bind(this.internalChain));},addSection:function(g,d){g=document.id(g);d=document.id(d);this.togglers.include(g);
this.elements.include(d);var f=this.togglers,c=this.options,h=f.contains(g),a=f.indexOf(g),b=this.display.pass(a,this);g.store("accordion:display",b).addEvent(c.trigger,b);
if(c.height){d.setStyles({"padding-top":0,"border-top":"none","padding-bottom":0,"border-bottom":"none"});}if(c.width){d.setStyles({"padding-left":0,"border-left":"none","padding-right":0,"border-right":"none"});
}d.fullOpacity=1;if(c.fixedWidth){d.fullWidth=c.fixedWidth;}if(c.fixedHeight){d.fullHeight=c.fixedHeight;}d.setStyle("overflow","hidden");if(!h){for(var e in this.effects){d.setStyle(e,0);
}}return this;},removeSection:function(f,b){var e=this.togglers,a=e.indexOf(f),c=this.elements[a];var d=function(){e.erase(f);this.elements.erase(c);this.detach(f);
}.bind(this);if(this.now==a||b!=null){this.display(b!=null?b:(a-1>=0?a-1:0)).chain(d);}else{d();}return this;},detach:function(b){var a=function(c){c.removeEvent(this.options.trigger,c.retrieve("accordion:display"));
}.bind(this);if(!b){this.togglers.each(a);}else{a(b);}return this;},display:function(b,c){if(!this.check(b,c)){return this;}var h={},g=this.elements,a=this.options,f=this.effects;
if(c==null){c=true;}if(typeOf(b)=="element"){b=g.indexOf(b);}if(b==this.previous&&!a.alwaysHide){return this;}if(a.resetHeight){var e=g[this.previous];
if(e&&!this.selfHidden){for(var d in f){e.setStyle(d,e[f[d]]);}}}if((this.timer&&a.link=="chain")||(b===this.previous&&!a.alwaysHide)){return this;}this.previous=b;
this.selfHidden=false;g.each(function(l,k){h[k]={};var j;if(k!=b){j=true;}else{if(a.alwaysHide&&((l.offsetHeight>0&&a.height)||l.offsetWidth>0&&a.width)){j=true;
this.selfHidden=true;}}this.fireEvent(j?"background":"active",[this.togglers[k],l]);for(var m in f){h[k][m]=j?0:l[f[m]];}if(!c&&!j&&a.resetHeight){h[k].height="auto";
}},this);this.internalChain.clearChain();this.internalChain.chain(function(){if(a.resetHeight&&!this.selfHidden){var i=g[b];if(i){i.setStyle("height","auto");
}}}.bind(this));return c?this.start(h):this.set(h).internalChain.callChain();}});