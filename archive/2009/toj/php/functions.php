<?php
	
function date_cmp($a,$b) {
	$atime = (empty($a['date_timestamp'])) ? strtotime($a['dc']['date']) : $a['date_timestamp'];
	$btime = (empty($b['date_timestamp'])) ? strtotime($b['dc']['date']) : $b['date_timestamp'];
	if ($atime == $btime) return 0;
	return ($atime > $btime) ? -1 : 1;
}

function autolink($text) { 
	$text = preg_replace('/\[img\]http:\/\/([^\s]*\/)([^\s)\?]+)([^\s]*)\[\/img\]/','(<a href="http://$1$2$3" title="$2">$2</a>)',str_replace("&#8203;","",$text));
	$text = preg_replace('/([\(\s])http:\/\/([^\s)]+)/','$1<a href="http://$2">http://$2</a>',str_replace("&#8203;","",$text));
	$text = preg_replace('/^http:\/\/([^\s)]+)/','<a href="http://$1">http://$1</a>',str_replace("&#8203;","",$text));
	return $text;
}

function widont($str = "") {
	$str = rtrim($str);
	$space = strrpos(str_replace('" title','"xtitle',str_replace('<a href','<axhref',$str)),' ');
	if ($space !== false) $str = substr($str, 0, $space).'&nbsp;'.substr($str, $space + 1);
	return $str;
}

?>