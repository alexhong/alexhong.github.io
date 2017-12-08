$(document).ready(function(){

	$('.expand').show().children('a').click(function(){
		$(this).parent().hide().parent().css('max-height','none');
	});
	
	form = $('form');
	f = {
		'a': form.filter('.a'),
		'b': form.filter('.a,.b'),
		'c': form.filter('.a,.b,.c'),
		'd': form.filter('.d'),
	}
	filter = $('#filter');
	count = $('span',filter);
	count.click(function(){
		form.show().next().hide();
		filter.removeAttr('class');
		count.attr('data-count',form.length).show();
	});
	$('i',filter).click(function(){
		g = $(this).attr('class');
		form.hide().next().show();
		f[g].show().next().hide();
		filter.attr('class',g);
		count.attr('data-count',f[g].length).show();
	});
	$('.'+filter.attr('data-class'),filter).click();
	
	$('#feedback').prepend('<a class="join"><span>join</span></a><span>, </span>');
	$('a.join, .shade').click(function(){
		$('h4.join a').toggleClass('show');
		$('.shade').fadeToggle(200);
	});
	
	form.attr('target','i').submit(function(){
		$(this).removeClass('visited').addClass('loading').children('a').prepend('<img class="spinner" src="images/spinner.gif" alt="" />');
  	});
	$('iframe').load(function(){
		spinner = $('.spinner');
		spinner.parent().parent().removeClass('loading').addClass('visited');
		spinner.remove();
    });
    
    if ($('div.check').length) checkCounts();
    
});

function APIresponse(info, a, tsid, sign, ecount, ename) {
	var name = htmlDecode(info.name.replace("'s Home Street",''));
	if (name != ename) a.parent().parent().append('<p class="warning name">'+ename+' is now named <a href="'+tsid+'/">'+name+'</a></p>')
	var features = info.features;
	if (!info.features || !(info.features.length > 0)) return;
	var i = false;
	var c = 'false';
	for (i = 0; i < info.features.length; i++) {
		var feature = info.features[i];
		if (sign == 'top' && feature.indexOf('Patch') >= 0) a.parent().parent().append('<p class="warning patch"><a href="'+tsid+'/">'+name+'</a> has empty patches</p>')
		if (feature.indexOf(ecount) >= 0 || (ecount[0] == '0' && feature.indexOf(ecount.substr(1)) == -1)) {
		  c = 'true';
		  break;
		}
	}
	a.addClass(c);
}

function checkCounts() {
	$('div.check').each(function() {
		var div = $(this);
		var resource = div.attr('class').replace('check ','');
		div.find('form').each(function() {
			var a = $(this).children('a');
			var tsid = a.attr('href').replace('/','');
			var sign = a.parent().parent().parent().attr('id');
			var ecount = a.text() + ' ' + resource;
			var ename = $(this).children('button').text();
			$.getJSON('http://api.glitch.com/simple/locations.streetInfo?street_tsid='+tsid, null, function() {
				var _a = a;
				var _tsid = tsid;
				var _sign = sign;
				var _ecount = ecount;
				var _ename = ename;
				return function(data, textStatus, jXHR) {
					APIresponse(data, _a, _tsid, _sign, _ecount, _ename);
				};
			}());
		});
	});
}

function htmlDecode(value) {
    if (value) {
        return $('<div />').html(value).text();
    } else {
        return '';
    }
}