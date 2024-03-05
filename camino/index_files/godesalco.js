/* eslint-disable no-undef */
// ESLint
/* global Modernizr, sitePath, pathPhp, curPage, pageLang, resPerPage, foco, posInputMsg */


// 1. VARIABLES
const resizeDelay = 200,
	scrollDelay = 200,
	pastYear = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toUTCString(),
	oneYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toUTCString(),
	fiveYears = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toUTCString(),
	maxh4h5onSide = 12,
	agrees_cookies = ($.cookie('agrees_cookies')) ? JSON.parse($.cookie('agrees_cookies')) : [],
	trans_linkslist = [],
	trans_pagedprev = [],
	trans_pagednext = [],
	trans_privmail = [],
	trans_del_msg = [],
	trans_view_msg = [],
	trans_replyshow_1 = [],
	trans_replyshow_2 = [];
let went2res = 0,
	respage = 1;
trans_linkslist['es'] = 'Lista de enlaces';
trans_pagedprev['es'] = 'Anterior';
trans_pagednext['es'] = 'Siguiente';
trans_privmail['es'] = 'Escribe un email a ';
trans_del_msg['es'] = 'Borrar el mensaje';
trans_view_msg['es'] = 'Editar el mensaje';
trans_replyshow_1['es'] = 'Mensaje nº';
trans_replyshow_2['es'] = ', dejado por ';
trans_linkslist['en'] = 'Links list';
trans_pagedprev['en'] = 'Previous';
trans_pagednext['en'] = 'Next';
trans_privmail['en'] = 'Write an e-mail to ';
trans_del_msg['en'] = 'Delete message';
trans_view_msg['en'] = 'Edit message';
trans_replyshow_1['en'] = 'Message #';
trans_replyshow_2['en'] = ', left by ';

if (window.location.hash && $('#secs a[href="' + window.location.hash + '"]').length) {
	activo = window.location.hash;
	history.replaceState(null, null, ' ');
}



// 2. FUNCIONES
function enfocar(seccion) {
	const elt =
		$(':input[name="' + foco + '"]:checked:visible', seccion)[0] ||
		$(':input[name="' + foco + '"]:visible', seccion)[0] ||
		$(':input:checked:visible', seccion)[0];
	elt.focus();
}


function activar(seccion, options) {
	let opts = $.extend({}, {enfocar: false, gotop: false}, options);
	const $seccion = $(seccion),
		pes = $('#secs a[href="' + seccion + '"]'),
		bye = $('#go_' + seccion.replace('#', ''));
	if (pes.length && !$(pes).is('.activo')) {
		$('#secs a, .sitePagesBye a').removeClass('activo');
		$('section').removeClass('flex');
		$(pes).add(bye).addClass('activo');
		$seccion.addClass('flex');
		if ($('.pagenav').length) {
			hilightPagenav($seccion);
		}
		if (opts.enfocar) {
			enfocar($seccion);
		}
		if (opts.gotop) {
			window.scroll({top: 0, left: 0});
		}
	}
}


function resizeCallback() {
	posInputMsg();
	if (typeof gMap != 'undefined') {
		google.maps.event.trigger(gMap, 'resize');
	}
}


function updateCookies(allowed_cookies) {
	if (!allowed_cookies.includes('forms')) {
		document.cookie = 'bc_posted_firmas=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_posted_anuncios=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_posted_lost=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_posted_encuesta_plata_exp=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_posted_encuesta_plata_loc=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_posted_encuesta_podense_exp=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_posted_encuesta_podense_loc=; expires=' + pastYear + '; path= ' + sitePath;
	}
	if (!allowed_cookies.includes('prefs')) {
		document.cookie = 'bc_posted_encuesta_podense_loc=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_trad=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_local_units=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_local_paper=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_maps_keynav=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_maps_iwopen=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_maps_places=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_maps_zoom=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_maps_type=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_perfil_c=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_perfil_f=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_perfil_h=; expires=' + pastYear + '; path= ' + sitePath;
		document.cookie = 'bc_perfil_v=; expires=' + pastYear + '; path= ' + sitePath;
		$('.onlyIfNoCookiePrefs').show();
	}
	if (allowed_cookies.includes('prefs')) {
		$('.onlyIfNoCookiePrefs').hide();
	}
}


function hilightPagednav(seccion) {
	$('.pagednav a.current', seccion).removeClass('current');
	$('.pagednav a', seccion).each(function(){
		if ($(this).data('paged') == respage) {
			$(this).addClass('current');
		}
	});
}


function hilightPagenav(ele) {
	let theId, $a, stop = false;
	$('.pagenav a.current').removeClass('current');
	$('.h4nav.hidable').addClass('hide');
	$('.h3conts h4, .h3conts h5', ele).each(function () {
		if (isAboveBottom(this)) {
			theId = this.id;
			if ($('.pagenav a[href="#' + theId + '"]').length) {
				$a = $('.pagenav a[href="#' + theId + '"]');
			}
			if (isBelowTop(this)) {
				stop = true;
			}
		}
		else {
			stop = true;
		}
		if (!!stop) {
			return false;
		}
	});
	if (!!$a) {
		$a.addClass('current');
		if ($a.parents('.h4nav.hidable').length) {
			$a.parents('.h4nav.hidable').removeClass('hide');
		}
		else {
			$a.parent('li').next('.h4nav.hidable').removeClass('hide');
		}
	}
}


function appendHrefs(elt) {
	const theId = elt.id;
	const hrefs = '<div class="hrefs"><h4>' + trans_linkslist[pageLang] + ':</h4><div></div></div>';
	$('.hrefs', elt).remove();
	$('article', elt).append(hrefs).find('a').showHref({
		siteLinks: typeof printedHrefsWithSitelinks == 'object' && printedHrefsWithSitelinks.includes(theId),
		hrefsBox: '#' + theId + ' .hrefs div'
	});
	$('.hrefs > div:empty', elt).parent('.hrefs').remove();
}


function showOwn(elt) {
	const vie = '<a href="#" class="view iconfont" title="' + trans_view_msg[pageLang] + '">5</a>';
	const del = '<a href="#" class="delete iconfont" title="' + trans_del_msg[pageLang] + '">6</a>';
	$('.h3conts .item, .h3conts .reply', elt).each(function() {
		if ($(this).data('own') == 1) {
			$(this).find('.right').empty().append(vie + del);
		}
	});
}


function getRes(elt) {
	if (went2res > 0) {
		$('.h3bar', elt)[0].scrollIntoView();
	}
	$('.h3conts .item', elt).remove();
	$('.h3conts', elt).prepend('<div class="loading"><div class="bar"></div></div>');

	$.ajax({
		url: pathPhp + 'results.php',
		data: ajaxData + '&respage=' + respage
	}).done(function(res) {
		const resLo = (respage - 1) * resPerPage + 1;
		const resHi = resLo + Math.min($(res).find('.sello').length, resPerPage) - 1;
		$('.resintvl', elt).text(resLo + ' - ' + resHi);
		$('.h3conts .loading', elt).remove();
		$('.h3conts', elt).prepend($(res).find('out').html());
		
		hilightPagednav(elt);
		showOwn(elt);
	
		$('.pagedprev', elt).toggleClass('inlineblock', respage > 1);
		$('.pagednext', elt).toggleClass('inlineblock', resTotLeft / resPerPage > respage);
		
		went2res++;
		
		appendHrefs(elt);
	});
}


function openPopup(popup) {
	popup.showModal();
}


function markLabelsChecked(selector) {
	$('input[type="radio"], input[type="checkbox"]', selector || document).each(function() {
		$('label[for="' + this.id + '"]').toggleClass('checked', this.checked);
	});
}



// 3. DOM READY
$(document).ready(function() {

	//// INITIAL
	// Detect old ua
	if (!Modernizr.csscalc) {
		$.ajax({
			url: pathPhp + 'badbrowser.php',
			data: 'lang=' + pageLang + '&curPage=' + curPage,
			dataType: 'json'
		}).done(function (json) {
			if (json.what == 'node') {
				$('article').prepend(json.reply);
			} else if (json.what == 'redirect') {
				top.location.replace(json.reply);
			}
		});
	}

	// Detect mobile
	if (is_mobile) {
		$('.nomobile').remove();
	}

	// Borrar las cookies no permitidas
	updateCookies(agrees_cookies);
	
	// Activación inicial de sección
	activar(activo);
	
	// Cambio de sección al cambiar el hash
	$(window).on('hashchange', function() {
		if ($('#secs a[href="' + window.location.hash + '"]').length) {
			activar(window.location.hash, {gotop: true});
			history.replaceState(null, null, ' ');
		}
	});


	//// SCROLLING
	$('aside .sidenav').on('click','a[href^="#"]',function(){
		// this.blur();
		$(this.hash)[0].scrollIntoView({behavior: 'smooth'});
		return false;
	});

	$('section h3').on('click', function() {
		$(this).parent('.h3bar')[0].scrollIntoView({behavior: 'smooth'});
	});

	$('section h4').on('click', function() {
		this.scrollIntoView({behavior: 'smooth'});
	});


	//// NAVEGACIÓN POR TECLADO
	$(document)
		.on('keydown', null, {keys: 'ctrl+right'}, function() {
			const $p = $('#secs nav a').filter(':visible');
			const l = $p.length;
			if (l > 1) {
				const cur_p = $('#secs nav a.activo');
				const cur_i = $('#secs nav a').index(cur_p);
				const new_i = cur_i + 1 == l ? 0 : cur_i + 1;
				const new_p = $('#secs nav a')[new_i];
				activar(new_p.hash);
			}
		})
		.on('keydown', null, {keys: 'ctrl+left'}, function() {
			const $p = $('#secs nav a').filter(':visible');
			const l = $p.length;
			if (l > 1) {
				const cur_p = $('#secs nav a.activo');
				const cur_i = $('#secs nav a').index(cur_p);
				const new_i = cur_i == 0 ? l - 1 : cur_i - 1;
				const new_p = $('#secs nav a')[new_i];
				activar(new_p.hash);
			}
		})
		.on('keydown', null, {keys: 'ctrl+down'}, function(e) {
			e.preventDefault();
			let targetsec = $('footer')[0];
			const scrollmargintop = parseFloat($('.h3bar').css('scrollMarginTop'));
			$('.h3bar:visible, h4:visible, h5:visible').each(function() {
				if (this.getBoundingClientRect().top - scrollmargintop > 1) {
					targetsec = this;
					return false;
				}
			});
			targetsec.scrollIntoView({behavior: 'smooth'});
		}).on('keydown', null, {keys: 'ctrl+up'}, function(e) {
			e.preventDefault();
			let targetsec = $('header')[0];
			$('.h3bar:visible, h4:visible, h5:visible').each(function() {
				if (this.getBoundingClientRect().top < -1) {
					targetsec = this;
				}
			});
			targetsec.scrollIntoView({behavior: 'smooth'});
		});


	//// DIALOGS
	$('dialog .cancel').click(function(){
		$(this).parents('dialog')[0].close();
		return false;
	});


	// POPUPS
	$('[data-switch]').on('click', function () {
		const popupid = $(this).data('switch'),
			popup = document.getElementById(popupid);
		if (popup.open) {
			popup.close();
		} else {
			openPopup(popup);
		}
		return false;
	});

	$('.popup').on('click', function (e) {
		const box = this.getBoundingClientRect();
		// La primera condición se debe a que hitting enter triggers click en (0, 0)... y no queremos eso.
		if (!(e.clientX == 0 && e.clientY == 0) && (e.clientY < box.top || e.clientY > box.bottom || e.clientX < box.left || e.clientX > box.right)) {
			this.close();
		}
	});

	$('.popup').on('close', function () {
		if (this.id == 'profilesettings') {
			$('.profilesettings-switch').removeClass('active');
		}
	});


	//// HEADER
	// H1
	$('#h1 .right').on('click', 'a', function() {
		if ($(this).is('.lang') && !$(this).is('.current')) {
			document.cookie = 'bc_trad=' + this.hash.substring(1) + '; expires=' + fiveYears + '; path=' + sitePath + '; sameSite=Strict';
			document.location.reload();
		}
		return false;
	});

	// Secs
	$('#secs nav').on('click', 'a', function() {
		activar(this.hash);
		return false;
	});

	// Keyboard shortcuts
	$('#shortcuts').tooltip({
		track: true,
		show: false,
		content: tipkeysPestana,
		position: {
			my: 'center bottom-15',
			at: 'center top'
		}
	});

	// User
	if (agrees_cookies.includes('prefs')) {
		const user_offset = -60 * new Date().getTimezoneOffset();  // En segundos por encima de UTC.
		document.cookie = 'bc_user_offset=' + user_offset + '; expires=' + fiveYears + '; path=' + sitePath + '; sameSite=Strict';
	}

	// Localization settings
	$('#localize .set').on('click', function() {
		const local_units = $('input[name="local_units"]:checked').val();
		const local_paper = $('input[name="local_paper"]:checked').val();
		const maps_keynav = $('input[name="maps_keynav"]:checked').val();
		const maps_iwopen = $('input[name="maps_iwopen"]:checked').val();

		if (typeof local_units != 'undefined') {document.cookie = 'bc_local_units=' + local_units + '; expires=' + fiveYears + '; path=' + sitePath + '; sameSite=Strict';}
		if (typeof local_paper != 'undefined') {document.cookie = 'bc_local_paper=' + local_paper + '; expires=' + fiveYears + '; path=' + sitePath + '; sameSite=Strict';}
		if (typeof maps_keynav != 'undefined') {document.cookie = 'bc_maps_keynav=' + maps_keynav + '; expires=' + fiveYears + '; path=' + sitePath + '; sameSite=Strict';}
		if (typeof maps_iwopen != 'undefined') {document.cookie = 'bc_maps_iwopen=' + maps_iwopen + '; expires=' + fiveYears + '; path=' + sitePath + '; sameSite=Strict';}

		if (!agrees_cookies.includes('prefs')) {
			agrees_cookies.push('prefs');
			document.cookie = 'agrees_cookies=' + JSON.stringify(agrees_cookies) + '; expires=' + fiveYears + '; path=' + sitePath + '; sameSite=Strict';
		}

		document.location.reload();
		return false;
	});
	
	// Cookie consent
	if (!$.cookie('agrees_cookies') || agrees_cookies.includes('forms')) {
		$('#cookies_forms_1').prop('checked', true);
	} else {
		$('#cookies_forms_0').prop('checked', true);
	}
	if (!$.cookie('agrees_cookies') || agrees_cookies.includes('prefs')) {
		$('#cookies_prefs_1').prop('checked', true);
	} else {
		$('#cookies_prefs_0').prop('checked', true);
	}

	if (!$.cookie('agrees_cookies')) {
		openPopup($('#cookieconsent')[0]);
	}
	
	$('#cookieconsent .set').on('click', function() {
		const cookieconsent = [];
		$('#cookieconsent input:checked').each(function() {
			if (this.value != 0) {
				cookieconsent.push(this.name.replace('cookies_', ''));
			}
		});
		document.cookie = 'agrees_cookies=' + JSON.stringify(cookieconsent) + '; expires=' + fiveYears + '; path=' + sitePath + '; sameSite=Strict';

		updateCookies(cookieconsent);

		document.location.reload();
		return false;
	});


	//// SELECCIÓN
	$('.seleccion .h3conts').on('click', 'a:hashLink', function() {
		document.seleccion_form.selectval.value = this.hash.substring(1);
		document.seleccion_form.submit();
		return false;
	});


	//// LEER
	$('section.leer').each(function() {
		const h5 = $('h5', this).length;
		const h4h5 = $('h4, h5', this).length;
		const hidable = (h4h5 > maxh4h5onSide) ? ' hidable' : '';
		$('.h4box', this).each(function(){
			const h4id = $('h4', this)[0].id;
			const $li = $('aside .sidenav a[href="#' + h4id + '"]').parent('li');
			if ($('h5', this).length) {
				let ul = '<ul class="h4nav' + hidable + '">';
				$('h5', this).each(function(k){
					const h5id = h4id.replace('h4', 'h5') + k;
					this.id = h5id;
					ul += '<li><a href="#' + h5id + '">' + $(this).text() + '</a></li>';
				});
				ul += '</ul>';
				$li.after(ul);
			}
		});
		if (h5 > 0) {
			$(this).find('.sidenav').siblings('.donate, .social').addClass('hideinright');
		}
		appendHrefs(this);
	});


	//// RESULTADOS
	if (ajaxData.length) {
		$('#resultados').each(function() {
			$('#resultados .h3conts').after('<div class="prevnext"></div>');
			$('#resultados .prevnext, #resultados .h3bar').append('<div class="right"><a href="#" class="sidebtn iconfont pagedprev">Y</a><span class="sidebtn resintvl"></span><a href="#" class="sidebtn iconfont pagednext">Z</a></div>');
			getRes(this);
		});
		$('.pagednav').on('click', 'a', function() {
			respage = $(this).data('paged');
			getRes($(this).parents('section'));
			return false;
		});
		$('.pagedprev').on('click', function() {
			respage--;
			getRes($(this).parents('section'));
			return false;
		});
		$('.pagednext').on('click', function() {
			respage++;
			getRes($(this).parents('section'));
			return false;
		});
	}

	$('#resultados .h3conts')
		.on('click', 'a.iconfont', function() {
			const dbid = $(this).parents('.nombre.loc').length ? $(this).parents('.nombre.loc').data('dbid') : $(this).parents('.reply, .item').eq(0).data('dbid'),
				table = $(this).parents('.h3conts').data('dbtable');
			if ($(this).is('.mailto:fakeLink')) {
				document.mailto.table.value = table;
				document.mailto.dbid.value = dbid;
				document.mailto.submit();
				return false;
			} else if ($(this).is('.replyto')) {
				const num = $(this).parents('.nombre').find('.num').text(),
					name = $(this).parents('.nombre').find('.name').text();
				$('#replyto').val(dbid);
				$('#replyshow').val(trans_replyshow_1[pageLang] + num + trans_replyshow_2[pageLang] + name + '.');
				$('#camporeplyshow').removeClass('hide');
				activar('#escribe', {enfocar: true});
				return false;
			} else if ($(this).is('.delete')) {
				document.own.delete.value = dbid;
				document.own.submit();
				return false;
			} else if ($(this).is('.view')) {
				document.own.view.value = dbid;
				document.own.submit();
				return false;
			}
		});

	$('#undelete').on('click', function() {
		const dbid = $(this).data('dbid');
		document.own.undelete.value = dbid;
		document.own.submit();
		return false;
	});

	$('#camporeplyshow .clear').on('click', function() {
		$('#replyto').val('0');
		$('#replyshow').val('');
		$('#camporeplyshow').addClass('hide');
		enfocar('#escribe');
		return false;
	});


	//// ESCRIBE
	$('.escribe form').on('submit', function() {
		if ($(this).find('.envia :input').is('.inactive')) {
			return false;
		}
		const $theMsgBox = $(this).find('.errmsg');
		if (!validaForm(this, null, $theMsgBox, pageLang)) {
			$theMsgBox.slideDown(0, function(){
				$(this)[0].scrollIntoView({behavior: 'smooth'});
			});
			posInputMsg();
			return false;
		} else {
			$(this).find('.envia :input').addClass('inactive');
			if (!!$(this).data('callback') === true) {
				var callback = $(this).data('callback');
				window[callback](this);
				return false;
			}
		}
	});

	if ($('.g-recaptcha').length) {
		$.getScript('https://www.google.com/recaptcha/api.js?hl=' + pageLang);
	}

	$('label[for="g-recaptcha"]').append(' *');
	$('.campos :input').not('[type="radio"]').filter('[required], [minlength]').each(function() {
		$('label[for="' + this.id + '"]').append(' *');
	});

});



// 4. RESIZE
$(window).on('resize', function() {
	if (window.resizeTimer) {
		clearTimeout(window.resizeTimer);
	}
	window.resizeTimer = setTimeout(resizeCallback, resizeDelay);
});



// 5. UNLOAD
$(window).on('unload', function() {
	if (typeof gMap != 'undefined') {
		google.maps.event.clearInstanceListeners(gMap);
	}
});
