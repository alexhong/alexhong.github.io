$(function(){

	var path = window.location.pathname;

	if (window.location.hostname === 'lx.tumblr.com' && document.referrer.split('/')[2] === 'xkit-extension.tumblr.com')
		window.location.replace('/retags');

	// redirect from ask to about
	// if (path.substr(0,4) === '/ask')
		// window.location.replace('/about');
	// redirect from search to tagged
	if (path.substr(0,8) === '/search/')
		window.location.replace('/tagged/'+path.substr(8));
	// redirect from page to permalink
	if (path.substr(0,6) === '/page/' && $('li.permalink>a').length === 1)
		window.location.replace($('li.permalink>a').attr('href'));
	// home link on homepage scrolls to top instead
	if (path === '/') {
		$('a[href="/"]').each(function(){
			if ($(this).text() === 'Home') 
				$(this).text('Top').parent().addClass('top'); 
		}).click(function(){
			$("html,body").animate({scrollTop:0}); 
			return false;
		});
	}
	
	// lx.tumblr/games
	if ($('#lx-games').length) {
		$.get('http://alexhong.net/games/',function(data){
			var html = data.responseText.replace(/<\/*p>/g,'').replace(/\s*(\u00a0\u00a0)\s*/g,'$1'),
				played = $(html).find('h1.played').parent();
			played.find('h1.played').remove();
			$('#lx-games').html(played.html());
		});
	}

	// iOS menu fix
	if ('ontouchend' in document)
		$('body').children().click(function(){});

	// autopagerize
	$('body.index.p1:not(.search)').length
		? $('body').attr('data-loading','true')
		: $('#p').removeClass('autopagerize_page_element')
	;

	// home link hover
	$('#menu .home>a').hover(function(){
		$('#home').toggleClass('highlight');
	});

	// responsive media
	fitMedia($('#p'));
	new MutationObserver(function(ms){
		var added=[]; ms.forEach(function(m){added.push(m.addedNodes[0])});
		fitMedia($(added));
	}).observe($('#p')[0],{childList:true});
	$(window).resize(function(){$('#p').find('.fitWrap').fit()});

	// Firefox notes fix
	var $n = $('#notes>ol');
	if ($n.length) {
		$n.find('span.action').stripText();
		new MutationObserver(function(ms){
			var added=[]; ms.forEach(function(m){added.push(m.addedNodes[0])});
			$(added).find('span.action').stripText();
		}).observe($n[0],{childList:true});
	}

	// photoset fix
	new MutationObserver(function(){
		$('.html_photoset>iframe').each(function(){
			$(this).width($(this).width());
		});
	}).observe($('body')[0],{childList:true,attributes:true});

});

function fitMedia(scope) {
	scope.find('.fitWrap')
		.fit();
	scope.find('.videoWrap')
		.fitVids({include:'div.youtube5placeholder'})
		.find('.fitVidsWrapper')
		.closest('.videoWrap')
		.addClass('full');
}

(function($){
	"use strict";
	$.fn.stripText = function(){
		this.each(function(){
			$(this).contents().filter(function(){return this.nodeType===3}).remove();
		});
		return this;
	};
	$.fn.fit = function(){
		this.find('img').each(function(){
			$(this).attr('width') < $(window).width()
				? $(this).closest('div').removeClass('full')
				: $(this).closest('div').addClass('full')
			;
		});
		this.find('.html_photoset,.audio_player').each(function(){
			$(window).width() > 700
				? $(this).parent().removeClass('full')
				: $(this).parent().addClass('full')
			;
			$(this).children('iframe').width($(this).width());
		});
		return this;
	};
	$.fn.fitVids = function(options){
		var include = [
			'iframe.tumblr_video_iframe',
			'iframe[src*="player.vimeo.com"]',
			'iframe[src*="youtube.com"]',
			'iframe[src*="youtube-nocookie.com"]',
			'iframe[src*="kickstarter.com"][src*="video.html"]',
			'object',
			'embed'
		];
		var exclude = [
			'.fitVidsWrapper>*',
			'object object',
			'object>embed'
		];
		if (options) {
			if (options.include)
				include.push(options.include);
			if (options.exclude)
				exclude.push(options.exclude);
		}
		this.find(include.join(',')).not(exclude.join(',')).each(function(){
			var $this = $(this),
				ah = parseInt($this.attr('height'),10),
				aw = parseInt($this.attr('width'),10),
				h = !isNaN(ah) ? ah : $this.height(),
				w = !isNaN(aw) ? aw : $this.width(),
				ratio = h/w;
			$this.removeAttr('height').removeAttr('width').css({
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%'
			}).wrap('<div class="fitVidsWrapper"></div>').parent().css({
				position: 'relative',
				width: '100%',
				paddingTop: (ratio*100)+'%'
			});
		});
		return this;
	};
})(jQuery);

/**
 * jQuery.ajax mid - CROSS DOMAIN AJAX 
 * ---
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.11
 * @updated 12-JAN-10
 * ---
 * Note: Read the README!
 * ---
 * @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
 */
/*
jQuery.ajax = (function(_ajax){
	var protocol = location.protocol,
		hostname = location.hostname,
		exRegex = RegExp(protocol + '//' + hostname),
		YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
		query = 'select * from html where url="{URL}" and xpath="*"';
	function isExternal(url) {
		return !exRegex.test(url) && /:\/\//.test(url);
	}
	return function(o) {
		var url = o.url;
		if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
			// Manipulate options so that JSONP-x request is made to YQL
			o.url = YQL;
			o.dataType = 'json';
			o.data = {
				q: query.replace(
					'{URL}',
					url + (o.data ?
						(/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
					: '')
				),
				format: 'xml'
			};
			// Since it's a JSONP request
			// complete === success
			if (!o.success && o.complete) {
				o.success = o.complete;
				delete o.complete;
			}
			o.success = (function(_success){
				return function(data) {
					if (_success) {
						// Fake XHR callback.
						_success.call(this, {
							responseText: (data.results[0] || '')
								// YQL screws with <script>s
								// Get rid of them
								.replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
						}, 'success');
					}
				};
			})(o.success);
		}
		return _ajax.apply(this, arguments);
	};
})(jQuery.ajax);
*/

/* 
* MODIFIED codysherman.com/tools/infinite-scrolling/code
* - allow on iPhone
* - when end reached, document.body.setAttribute("data-loading","false");
*/

var tumblrAutoPager={url:"http://proto.jp/",ver:"0.1.7",rF:true,gP:{},pp:null,ppId:"",LN:location.hostname,init:function(){if($("autopagerize_icon"))return;var tAP=tumblrAutoPager;var p=1;var lh=location.href;var lhp=lh.lastIndexOf("/page/");var lht=lh.lastIndexOf("/tagged/");if(lhp!=-1){p=parseInt(lh.slice(lhp+6));tAP.LN=lh.slice(7,lhp);}else if(lht!=-1){tAP.LN=lh.slice(7);if(tAP.LN.slice(tAP.LN.length-1)=="/")tAP.LN=tAP.LN.slice(0,tAP.LN.length-1);}else if("http://"+tAP.LN+"/"!=lh){return;};var gPFncs=[];gPFncs[0]=function(aE){var r=[];for(var i=0,l=aE.length;i<l;i++){if(aE[i].className=="autopagerize_page_element"){r=gCE(aE[i]);break;}}
return r;};gPFncs[1]=function(aE){var r=[];for(var i=0,l=aE.length;i<l;i++){var arr=aE[i].className?aE[i].className.split(" "):null;if(arr){for(var j=0;j<arr.length;j++){arr[j]=="post"?r.push(aE[i]):null;}}}
return r;};gPFncs[2]=function(aE){var r=[];var tmpId=tAP.ppId?[tAP.ppId]:["posts","main","container","content","apDiv2","wrapper","projects"];for(var i=0,l=aE.length;i<l;i++){for(var j=0;j<tmpId.length;j++){if(aE[i].id==tmpId[j]){r=gCE(aE[i]);tAP.ppId=aE[i].id;break;}}}
return r;};for(var i=0;i<gPFncs.length;i++){var getElems=gPFncs[i](document.body.getElementsByTagName('*'));if(getElems.length){tAP.gP=gPFncs[i];tAP.pp=getElems[0].parentNode;break;}}
function gCE(pElem){var r=[];for(var i=0,l=pElem.childNodes.length;i<l;i++){r.push(pElem.childNodes.item(i))}
return r;}
if(!tAP.pp){return;}
sendRequest.README={license:'Public Domain',url:'http://jsgt.org/lib/ajax/ref.htm',version:0.516,author:'Toshiro Takahashi'};function chkAjaBrowser(){var A,B=navigator.userAgent;this.bw={safari:((A=B.split('AppleWebKit/')[1])?A.split('(')[0].split('.')[0]:0)>=124,konqueror:((A=B.split('Konqueror/')[1])?A.split(';')[0]:0)>=3.3,mozes:((A=B.split('Gecko/')[1])?A.split(' ')[0]:0)>=20011128,opera:(!!window.opera)&&((typeof XMLHttpRequest)=='function'),msie:(!!window.ActiveXObject)?(!!createHttpRequest()):false};return(this.bw.safari||this.bw.konqueror||this.bw.mozes||this.bw.opera||this.bw.msie)}
function createHttpRequest(){if(window.XMLHttpRequest){return new XMLHttpRequest()}else{if(window.ActiveXObject){try{return new ActiveXObject('Msxml2.XMLHTTP')}catch(B){try{return new ActiveXObject('Microsoft.XMLHTTP')}catch(A){return null}}}else{return null}}};function sendRequest(E,R,C,D,F,G,S,A){var Q=C.toUpperCase()=='GET',H=createHttpRequest();if(H==null){return null}
if((G)?G:false){D+=((D.indexOf('?')==-1)?'?':'&')+'t='+(new Date()).getTime()}
var P=new chkAjaBrowser(),L=P.bw.opera,I=P.bw.safari,N=P.bw.konqueror,M=P.bw.mozes;if(typeof E=='object'){var J=E.onload;var O=E.onbeforsetheader}else{var J=E;var O=null}
if(L||I||M){H.onload=function(){J(H);H.abort()}}else{H.onreadystatechange=function(){if(H.readyState==4){J(H);H.abort()}}}
R=K(R,D);if(Q){D+=((D.indexOf('?')==-1)?'?':(R=='')?'':'&')+R}
H.open(C,D,F,S,A);if(!!O){O(H)}
B(H);H.send(R);function B(T){if(!L||typeof T.setRequestHeader=='function'){T.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8')}
return T}
function K(X,V){var Z=[];if(typeof X=='object'){for(var W in X){Y(W,X[W])}}else{if(typeof X=='string'){if(X==''){return''}
if(X.charAt(0)=='&'){X=X.substring(1,X.length)}
var T=X.split('&');for(var W=0;W<T.length;W++){var U=T[W].split('=');Y(U[0],U[1])}}}
function Y(b,a){Z.push(encodeURIComponent(b)+'='+encodeURIComponent(a))}
return Z.join('&')}
return H}
function addNextPage(oj){if(oj.status==404){tAP.remainFlg=false;return;}
var d=document.createElement("div");d.innerHTML=oj.responseText;var posts=tAP.gP(d.getElementsByTagName("*"));if(posts.length<2){document.body.setAttribute("data-loading","false");tAP.rF=false;return;}
d=document.createElement("div");d.className="tumblrAutoPager_page_info";tAP.pp.appendChild(d);for(var i=0;i<posts.length;i++){tAP.pp.appendChild(posts[i]);}
var footer=$("footer");footer?footer.parentNode.appendChild(footer):null;tAP.rF=true;}
watch_scroll();function watch_scroll(){var d=document.compatMode=="BackCompat"?document.body:document.documentElement;var r=d.scrollHeight-d.clientHeight-(d.scrollTop||document.body.scrollTop);if(r<d.clientHeight*2&&tAP.rF){tAP.rF=false;p++;

	addNextPageWithLikes = function(oj) {
		addNextPage(oj);
		Tumblr.LikeButton.get_status_by_page(p);
	}

	sendRequest(addNextPageWithLikes,"","GET","http://"+tAP.LN+"/page/"+p,true);

}
setTimeout(arguments.callee,200);};function $(id){return document.getElementById(id)};},switchAutoPage:function(){this.rF=!this.rF;var aE=document.getElementsByTagName('*');for(var i=0,l=aE.length;i<l;i++){if(aE[i].className=="tAP_switch"){aE[i].firstChild.nodeValue=this.rF?"AutoPage[OFF]":"AutoPage[ON]";}}}};window.addEventListener?window.addEventListener('load',tumblrAutoPager.init,false):window.attachEvent?window.attachEvent("onload",tumblrAutoPager.init):window.onload=tumblrAutoPager.init;