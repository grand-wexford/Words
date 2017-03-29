<?php 
$txt = file('dict.txt'); 
$str = $txt[ array_rand($txt) ]; 
unset($txt); 
echo $str;
