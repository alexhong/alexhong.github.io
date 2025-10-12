<?php 

parse_str($_SERVER['QUERY_STRING'],$query); 
if (isset($query['edit'])) $route = $query['edit'];
$file = $route.'.txt';

$error = '';
if (file_exists($file)) {
	$content = file_get_contents($file);
	$title = 'Serious '.ucfirst($route);
} else {
	// header('location:http://seriousroutes.com/');
}

if (isset($_POST['content'])) {
	$content = trim(str_replace(' ',' ',strip_tags(str_replace('<!--','',str_replace('-->','',stripslashes($_POST['content']))))));
	if ($_POST['password'] == 'maltakan01') {
		$fp = fopen($file,'w') or die ('Error opening file!');
		fputs($fp,$content);
		fclose($fp) or die ('Error closing file!');
		// header('location:http://seriousroutes.com/?s=0');
	} else {
		$error = "<b>Incorrect password!</b>";
	}
}

?>
<!DOCTYPE html>

<html lang="en">

<head>
<title><?php echo $title; ?></title>
<meta charset="utf-8" />
<meta name="robots" content="none" />
<meta name="viewport" content="initial-scale=1, minimum-scale=1, maximum-scale=1" />
<link rel="stylesheet" href="../style.css" />
</head>

<body class="edit">
<?php if (file_exists($file)) echo'
<form action="'.$_SERVER['REQUEST_URI'].'" method="post">
<div>
<input type="password" name="password" placeholder="password" />
<input type="submit" value="Publish" /> '.$error.'
</div>
<textarea rows="20" cols="50" name="content">'.$content.'</textarea>
</form>
';
?>

</body>

</html>