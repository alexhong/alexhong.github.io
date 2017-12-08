$(function(){
	if (location.protocol == 'http:') $('a.index').attr('href','../');
	$('[title]').each(function(){
		var l = $(this).attr('title');
		l >= 5000 ? $(this).addClass('a')
		: l >= 1000 ? $(this).addClass('b')
		: l >= 500 ? $(this).addClass('c') 
		: l >= 100 ? $(this).addClass('d') 
		: '';
	});
});