<?php
session_start();

$post_data = http_build_query(
    array(
        'secret' => '6LepDTQUAAAAAAncUKYkxtmYv3e5DqatCu2SWTQ7',
        'response' => $_POST['g-recaptcha-response'],
        'remoteip' => $_SERVER['REMOTE_ADDR']
    )
);
$opts = array('http' =>
    array(
        'method'  => 'POST',
        'header'  => 'Content-type: application/x-www-form-urlencoded',
        'content' => $post_data
    )
);
$context  = stream_context_create($opts);
$response = file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $context);
$captchaResult = json_decode($response);
if (!$captchaResult->success) {
    // TODO return a beautiful captcha is wrong err
    echo 'Incorrect captcha';
}else{
    $_SESSION['username'] = $_POST['username'];
    header("Refresh:0; url=index.php");
}
