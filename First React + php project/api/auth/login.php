<?php
    require_once __DIR__ . "/../vendor/autoload.php";
    require_once __DIR__ . "/../config/jwt.php";

    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

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

    $email = isset($input['email']) ? trim($input['email']) : '';
    $password = isset($input['password']) ? $input['password'] : '';

    if (!$email || !$password) {
        http_response_code(400);
        echo json_encode(["error" => "Email and password are required"]);
        exit;
    }

    require_once __DIR__ . "/../config/database.php";

    try {
        $stmt = $conn->prepare("SELECT id, firstName, lastName, email, password, role FROM users WHERE LOWER(email) = LOWER(?)");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($password, $user['password'])) {
            http_response_code(401);
            echo json_encode(["error" => "Invalid email or password"]);
            exit;
        }

        // Generate JWT token
        $payload = [
            "iss" => JWT_ISSUER,
            "aud" => JWT_ISSUER,
            "iat" => time(),
            "nbf" => time(),
            "exp" => time() + JWT_EXPIRE,
            "data" => [
                "id" => (int)$user['id'],
                "email" => $user['email'],
                "role" => $user['role']
            ]
        ];

        $token = JWT::encode($payload, JWT_SECRET, 'HS256');

        http_response_code(200);
        echo json_encode([
            "message" => "Login successful",
            "token" => $token,
            "user" => [
                "id" => (int)$user['id'],
                "firstName" => $user['firstName'],
                "lastName" => $user['lastName'],
                "email" => $user['email'],
                "role" => $user['role']
            ]
        ]);
    }
    catch (PDOException $e) {
        // Log error securely (not to expose details to client)
        error_log("Login error: " . $e -> getMessage());

        http_response_code(500);
        echo json_encode(["error" => "Server error"]);
    }
    catch (Exception $e) {
        // Catch JWT encoding errors
        error_log("JWT error: " . $e->getMessage());

        http_response_code(500);
        echo json_encode(["error" => "Server error"]);
    }
?>