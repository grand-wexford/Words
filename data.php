<?

ini_set( 'display_errors', '1' );
ini_set( 'error_reporting', E_ALL );
error_reporting( 'E_ALL' );

ini_set( 'error_reporting', E_ALL );
ini_set( 'display_errors', 1 );
ini_set( 'display_startup_errors', 1 );
$a = $_POST['a'];

switch ( $a ) {
	case 'getword':
		$txt = file( 'dict.txt' );
		$str = $txt[array_rand( $txt )];
		unset( $txt );
		echo trim( $str );

		break;
	case 'getwords':
		$txt = file( 'dict.txt' );
		$c = intval( $_POST['c'] ) > 0 ? intval( $_POST['c'] ) : 1;
		$arr = array_rand( $txt, $c );

		$words = array();
		foreach ( $arr as $id ) {
			$words[] = trim( $txt[$id] );
		}

		unset( $txt );
		echo json_encode( $words );

		break;

	default:
		break;
}

