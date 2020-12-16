var indexOf = [].indexOf ||
    function(item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item) return i;
        }
        return -1;
    };

function get_config(cfg) {
    var default_cfg = {
        customer_id: 0,
        host: 'www.msgapp.com',
        ip_privacy: 0,
        subsite: '',
        
        __img_path: '/web-next.gif?'
    }
    
    for (var k in default_cfg) {
        if (default_cfg.hasOwnProperty(k)) {
            var v = default_cfg[k];
            if (default_cfg.hasOwnProperty(k)) {
                if (indexOf.call(Object.keys(cfg), k) < 0) {
                    cfg[k] = v;
                }
            }
        }
    }

    cfg.__img_url = '//' + cfg['host'] + cfg.__img_path;

    return cfg;
}

function Get_Cookie(check_name) {
    // first we'll split this cookie up into name/value pairs
    // note: document.cookie only returns name=value, not the other components
    var a_all_cookies = document.cookie.split(';');
    var a_temp_cookie = '';
    var cookie_name = '';
    var cookie_value = '';
    var b_cookie_found = false; // set boolean t/f default f

    for (i = 0; i < a_all_cookies.length; i++) {
        // now we'll split apart each name=value pair
        a_temp_cookie = a_all_cookies[i].split('=');

        // and trim left/right whitespace while we're at it
        cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

        // if the extracted name matches passed check_name
        if (cookie_name === check_name) {
            // we need to handle case where cookie has no value but exists (no = sign, that is):
            if (a_temp_cookie.length > 1) {
                cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
            }
            // note that in cases where cookie is initialized but no value, null is returned
            return cookie_value;
            break;
        }
        a_temp_cookie = null;
    }
    if (!b_cookie_found) {
        return null;
    }
}

function PrefixChar(strValue, strCharPrefix, intLength) {
    var intStrValue_length = String(strValue).length;
    if (intStrValue_length < intLength) {
        for (var intI = 0; intI < (intLength - intStrValue_length) ; ++intI) {
            strValue = strCharPrefix + strValue;
        }
    }
    return strValue;
}

function tzs() {
    var d = new Date();

    var tz = d.getTimezoneOffset();
    var sign = (tz > 0 ? '-' : '+');
    var tzh = Math.floor(Math.abs(tz) / 60);
    var tzm = Math.abs(tzh - (Math.abs(tz) / 60)) * 60;
    var tzst = 'UTC' + sign + PrefixChar(tzh, '0', 2) + PrefixChar(tzm, '0', 2);

    return tzst;
}

function hem() {
    var now = new Date();
    var fynow = now.getFullYear();
    var tzst = tzs();

    var om1 = new Date('1 Jan ' + fynow + ' 00:00:00 ' + tzst);
    var om7 = new Date('1 Jul ' + fynow + ' 00:00:00 ' + tzst);


    var m1 = om1.getTimezoneOffset();
    var m7 = om7.getTimezoneOffset();
    var h = 'E';

    if (m1 !== m7) {
        h = m1 > m7 ? 'N' : 'S';
    }
    return h;
}

function frt(cfg) {
    var version = 'js2.1';

    cfg = get_config(cfg);
    var jsv = '1.3';

    var durl = document.URL;
    var title = document.title;

    var params = {
        v: version,
        cid: cfg.customer_id,
        cke: Get_Cookie('civicAllowCookies'),
        u: durl,
        t: title,
        l: navigator.language,
        je: navigator.javaEnabled(),
        re: screen.width + 'x' + screen.height,
        cd: screen.colorDepth,
        pd: screen.pixelDepth,
        os: navigator.platform,
        ua: navigator.userAgent,
        ref: window.document.referrer,
        h: hem(),
        tz: tzs(),
        jsv: jsv,
        ss: cfg.subsite
    }

    if (cfg.ip_privacy === 1) params['p'] = cfg.ip_privacy;

    var url = cfg.__img_url;

    for (var k in params) {
        if (params.hasOwnProperty(k)) {
            var v = params[k];
            if (v) {
                url += '&' + k + '=' + (encodeURIComponent(v));
            } else {
                url += '&' + k + '=';
            }
        }
    }

    if (url.length > 2048 && navigator.userAgent.indexOf('MSIE') >= 0) {
        url = url.substring(0, 2043) + '&cut=1';
    }

    var i = document.createElement('img');
    i.src = url;
}
