<?php

require_once "magpierss/rss_fetch.inc";
require_once "functions.php";
require_once "smartypants.php";

$items = array();

// Fetch feed
$rss = fetch_rss('http://twitter.com/statuses/user_timeline/94003002.rss');

// Add feed items
foreach (array_reverse($rss->items) as $item) $items[] = $item;
	
// Sort items by date
usort($items,'date_cmp');

// PROCESS ITEMS
foreach (array_slice($items,($page*$n)-$n,$n) as $item) {
	extract($item);
    $link = str_replace('&','&amp;',$link);

    ($item['title'])
    	? $title = 
    		htmlspecialchars(
    		preg_replace("/\s+/"," ",
       		str_replace("“",'"',
       		str_replace("”",'"',
    		$title))),ENT_NOQUOTES,'',0) 
    	: $title = '(Untitled)'; 	
	$classname = strtolower(str_replace(" ","",$feedname))." $feedtype";
        
    // Strip name
	$title = preg_replace('/^([^\s]+) /','',$title);
	$classname .= ' status';
    
    $description = 
    	htmlspecialchars(
    	preg_replace("/\s+/"," ",
       	str_replace("&#8230;","...",
       	str_replace("“",'"',
       	str_replace("”",'"',
    	trim(
    	$item['description']))))),ENT_NOQUOTES,'',0);
    
	// Get item date
    $date = '';
	$rss_2_date = $item['pubdate'];
	$rss_1_date = $item['dc']['date'];
	$atom_date = $item['issued'];
	if ($atom_date != "") $date = parse_w3cdtf($atom_date);
	if ($rss_1_date != "") $date = parse_w3cdtf($rss_1_date);
	if ($rss_2_date != "") $date = strtotime($rss_2_date);
	if ($date == "") $date = time();
	
	// Set lastbuilddate for RSS if first item
	if (!isset($lastbuilddate)) $lastbuilddate = $date;
	
	echo "<li>".widont(autolink(SmartyPants($title)))." <!--<span class=\"time\">&nbsp;".date('g:i A',$date)."</span>--></li>\n";
}
?>