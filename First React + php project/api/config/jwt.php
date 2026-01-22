<?php
    require_once __DIR__ . '/../vendor/autoload.php';

    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();

    define('JWT_SECRET', $_ENV['JWT_SECRET']);
    define('JWT_ISSUER', $_ENV['JWT_ISSUER']);
    define('JWT_EXPIRE', (int)$_ENV['JWT_EXPIRE']);
?>