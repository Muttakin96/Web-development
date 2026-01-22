<?php
    require_once __DIR__ . '/../vendor/autoload.php';

    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();

    $host = $_ENV['DB_HOST'];
    $db_name = $_ENV['DB_NAME'];
    $username = $_ENV['DB_USER'];
    $password = $_ENV['DB_PASS'];
    $charset = $_ENV['DB_CHARSET'] ?? 'utf8mb4';
    
    try {
        $conn = new PDO("mysql:host={$host};dbname={$db_name};charset={$charset}", $username, $password);

        $conn -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch (PDOException $e) {
        die(json_encode(["error" => "Database connection failed: " . $e -> getMessage()]));
    }
?>