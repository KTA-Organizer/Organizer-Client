<?php
include_once "header.html";
include_once "showFunctions.php";

session_start();

if(isset($_SESSION['email'])){
    showNavigation($_SESSION['name']);
    checkGET();
}elseif(isset($_POST['email'])){
    $_SESSION['email'] = $_POST['email'];
    showNavigation($_SESSION['name']);
    checkGET();
}else{
    showLogin();
}

function checkGET()
{
    if (isset($_GET['page'])) {
        switch ($_GET['page']) {
            case "account":
                showAccount($_SESSION['email']);
                break;

            case "afmelden":
                unset($_SESSION['email']);
                header("Refresh:0; url=index.php");
                break;

            case "rapporten":
                showReportsPage();
                break;

            case "studenten":
                showStudentsPage();
                break;

            case "opleidingen":
                showSubjectPage();
                break;

            case "meldingen":
                showMessagesPage();
                break;

            case "afdrukken":
                showPrintPage();
                break;

            case "editStudent":
                showStudentEditPage();
                break;

            case "editOpleiding":
                showOpleidingEditPage();
                break;
        }

    } else {
        showStart();
    }
}

include_once "footer.html";
?>
