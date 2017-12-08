<?php 

$top = array(
array(12,14,'beans','trees',1),
array(12,14,'bubbles','trees',2),
array(12,14,'eggs','trees',3),
array(12,14,'fruit','trees',4),
array(12,14,'gas','trees',5),
array(12,14,'spice','trees',6),
);

$bottom = array(
array(36,54,'barnacles','barnacles',7),
array(12,18,'dirt','piles',8),
array(36,48,'jellisac','jellisac',10),
array(12,17,'metal','rocks',11),
array(12,17,'peat','bogs',12),
array(12,15,'sparkly','rocks',13),
);

if (isset($_REQUEST['all']) || isset($_REQUEST['check'])) {
	if (!isset($_REQUEST['s'])) $_REQUEST['s'] = '';
	if (!isset($_REQUEST['l'])) $_REQUEST['l'] = '';
	if (!isset($_REQUEST['g'])) $_REQUEST['g'] = '';
}

if (isset($_REQUEST['modified']) && !isset($_REQUEST['s'])) $_REQUEST['s'] = 1;

if (isset($_REQUEST['g'])) { 
	$g = $_REQUEST['g'];
	if ($g!=='a' && $g!=='b' && $g!=='c' && $g!=='d') $g = 'x';
} else {
	$g = 'c';
}

$top = build($top);
$bottom = build($bottom);

function build($routes) {
	foreach ($routes as $r) {
		$html = array();
		$count = 0;
		$warnings = 0;
		$invalid = 0;
		$lines = explode("\n",str_replace("\n-",' -',file_get_contents('routes/'.$r[2].'.txt')));
		foreach ($lines as $l) {
			if (strpos($l,': ') != 15) { $invalid++; continue; }
			$m = explode('|',str_replace(']','|',str_replace(' [','|',substr($l,17))));	
			array_unshift($m,substr($l,0,15));				
			$count += $m[2];
			switch (TRUE) {
				case ($m[2] >= $r[1]): 				$class = 'a'; break;
				case ($m[2] >= ($r[1]+$r[0])/2):	$class = 'b'; break;
				case ($m[2] >= $r[0]):				$class = 'c'; break;
				default:							$class = 'd';
			}
			$broken = '';
			if (substr(trim($m[3]),0,1) == '-') {
				$broken = '<strong>&mdash;/ /&mdash;</strong>';
				$warnings++;
			}
			$html[] = '
<form action="'.$m[0].'/" method="post" class="'.$class.'"><button type="submit">'.$m[1].'</button> <a href="//glitchthegame.com/locations/'.$m[0].'/">'.((isset($m[2]))?$m[2]:'???').'</a><input type="hidden" value="1" name="visit"></form><b title="'.$m[1].' ('.$m[2].')"></b>'.$broken;
		}
		if (isset($_REQUEST['density'])) {
			$sort = $count/(count($html)*($r[1]+$r[0]/12));
		} else if (isset($_REQUEST['modified'])) {
			$sort = filemtime('routes/'.$r[2].'.txt');
		} else {
			$sort = $count/$r[0];
		}
		array_unshift($r,$sort,$count);
		array_push($r,$html,substr($lines[0],17,strpos($lines[0].' [',' [')-17),trim(substr($lines[0],strpos($lines[0],']')+2)),$warnings,$invalid);
  		$routes[] = $r;
  		array_shift($routes);
	}
	rsort($routes);
	return $routes;
}

function print_routes($routes) {
	foreach ($routes as $r) {
		$sort = array_shift($r);
		$resources = array_shift($r);
		$members = count($r[5]);	
		$estimate = ($r[3] == 'trees') ? ' (~'.round($resources*0.0312).'k '.$r[2].')' : '';
		$warning = '';
		if ($r[8]) $warning .= "\n".'<h4 class="warning"><strong>&mdash;/ /&mdash;</strong> '.$r[8].' broken</h4>';
		if ($r[9]) $warning .= "\n".'<h4 class="warning">'.$r[9].' invalid</h4>';
		$join = (strlen($r[7]) == 15) 
			? "\n".'<h4 class="join"><a href="//glitchthegame.com/profiles/'.$r[7].'/"><span>contact <b>'.$r[6].'</b> to join<br />minimum <b>'.$r[0].'</b> '.$r[3].'</span></a></h4>'
			: "\n".'<h4 class="join no"><a href="mailto:Lx@seriousroutes.com"><span><b>no curator</b><br />email to apply</span></a></h4>'
		;
		if (isset($_REQUEST['density'])) {
			$sorted = "\n".'<h4><b>'.number_format($sort*100,1).'%</b></h4>';
		} else if (isset($_REQUEST['modified'])) {
			$sorted = "\n".'<h4><b>'.time_ago($sort).'</b></h4>';
		} else {
			$sorted = '';
		}
		$check = ($r[2] == 'barnacles') ? 'Mortar' : ucfirst($r[2]);
		if (substr($check,-1) == 's') $check = substr($check,0,-1);
		echo '
<h3 style="background-position: 10px -'.(($r[4]-1)*32).'px"><a href="routes/?edit='.$r[2].'">'.ucfirst($r[2]).'</a></h3>
<h4><b>'.$resources.'</b> '.$r[3].$estimate.' @ '.$members.'</h4>'.$sorted.$warning.$join.'
<div'.((strtolower($_REQUEST['check']) == $r[2] || $_REQUEST['check'] === '')?' class="check '.$check.'"':'').'>';
		$start = (isset($_REQUEST['s']) && $_REQUEST['s'] >= 0 && $_REQUEST['s'] != 'r') ? intval($_REQUEST['s']) : rand(0,$members-1);
		for ($i = 0; $i < $members; $i++) echo $r[5][($i+$start)%$members];
		echo '
<div class="expand"><a></a></div>
</div>
';
	}
	echo "\n";
}

function time_ago($timestamp)
{
    $diff=time()-$timestamp;

    $min=60;
    $hour=60*60;
    $day=60*60*24;
    $month=$day*30;

    if($diff<60) //Under a min
    {
        $timeago = $diff . "s";
    }elseif ($diff<$hour) //Under an hour
    {
        $timeago = round($diff/$min) . "m";
    }elseif ($diff<$day) //Under a day
    {
        $timeago = round($diff/$hour) . "h";
    }elseif ($diff<$month) //Under a day
    {
        $timeago = round($diff/$day) . "d";
    }else 
    {
        $timeago = round($diff/$month) . "mo";
    }

    return $timeago;

}

?>
<!DOCTYPE html>

<html lang="en">

<head>
<title>Serious Routes</title>
<meta charset="utf-8" />
<meta name="viewport" content="initial-scale=1, minimum-scale=1">
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="apple-mobile-web-app-title" content="Serious" />
<link rel="apple-touch-icon-precomposed" href="images/webclip.png" /> 
<!-- <link rel="shortcut icon" href="images/favicon.ico" /> -->
<link rel="stylesheet" href="style.css" />
<?php 
$lines = (isset($_REQUEST['l'])) ? intval($_REQUEST['l']) : 3;
if ($lines < 0) $lines = 0;
if ($lines) echo '<style>h4 + div { max-height: '.($lines*20+20).'px; } .expand { top: '.($lines*20).'px; }</style>
'; ?>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script src="script.js"></script>
</head>

<body>

<div id="header">
<h1>Serious Routes</h1>
<p id="filter" data-class="<?php echo $g; ?>">
	<i class="d"><b></b></i>
	<i class="c"><b></b></i>
	<i class="b"><b></b></i>
	<i class="a"><b></b></i>
	<span class="x"></span>
</p>
<p id="feedback">
	<a class="email" href="mailto:Lx@seriousroutes.com"><span>email</span></a>
</p>
</div>

<div id="routes">

<div id="top">
<h2>top sign routes</h2>
<?php print_routes($top); ?>
</div>

<div id="bottom">
<h2>bottom sign routes</h2>
<?php print_routes($bottom); ?>
</div>

</div>

<div id="footer">
	<p>Resource estimates are calculated with all Arborology skills and upgrades (average 31.2 per&nbsp;tree).</p>
	<p>Brought to you by <a href="//glitchthegame.com/profiles/PIF5BPPLOK535TE/">Lx</a> and <a href="//glitchthegame.com/profiles/PHF2REJC9UC2P42/">tis</a>, with special thanks to <a href="//glitchthegame.com/profiles/PA9VHKNCKQD2LUN/">TomC</a>, <a href="//glitchthegame.com/profiles/PUV89PBTCNF26U4/">Janitch</a>, <a href="//glitchthegame.com/profiles/PIF6RN35T3D1DT2/">ping</a>, and the <a href="//glitchthegame.com/groups/RUVQIG2BJ1H2AO1/">Game of Crowns</a>&nbsp;group.</p>
</div>

<iframe name="i" height="0" width="0" style="display:none"></iframe>
<div class="shade"></div>

</body>

</html>