<?php
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: POST, OPTIONS");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        exit;
    }

    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input || json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON body"]);
        exit;
    }

    $firstName = trim($input["firstName"] ?? '');
    $lastName = trim($input["lastName"] ?? '');
    $email = trim($input["email"] ?? '');
    $password = $input["password"] ?? '';

    if (!$firstName || !$lastName || !$email || !$password) {
        http_response_code(400);
        echo json_encode(["error" => "All fields are required"]);
        exit;
    }

    if (strlen($firstName) > 50 || strlen($lastName) > 50) {
        http_response_code(400);
        echo json_encode(["error" => "Names must be 50 characters or less"]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid email address"]);
        exit;
    }

    if (strlen($password) < 8) {
        http_response_code(400);
        echo json_encode(["error" => "Password should be atleast 8 characters!"]);
        exit;
    }

    require_once __DIR__ . "/../config/database.php";

    try {
        $stmt = $conn -> prepare("SELECT 1 FROM users WHERE email = ? LIMIT 1");
        $stmt -> execute([$email]);

        if ($stmt -> fetch()) {
            http_response_code(409);
            echo json_encode(["error" => "Email already exists"]);
            exit;
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $conn -> prepare(
            "INSERT INTO users (firstName, lastName, email, password)
            VALUES (?, ?, ?, ?)"
        );

        $stmt -> execute([$firstName, $lastName, $email, $hashedPassword]);

        http_response_code(201);
        echo json_encode(["message" => "User registered successfully", 
        "userId" => (int)$conn->lastInsertId()]);
    }
    catch (PDOException $e) {
        error_log("Registration error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => "Server error"]);
    }
?>