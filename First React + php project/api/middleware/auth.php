<?php
    require_once "../vendor/autoload.php";
    require_once "../config/jwt.php";

    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;
    use Firebase\JWT\ExpiredException;

    function authenticate() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (!$authHeader) {
            http_response_code(401);
            echo json_encode(["error"=>"Unauthorized","message"=>"Authorization header missing"]);
            exit;
        }

        if (!preg_match('/Bearer\s+(.+)$/i', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(["error"=>"Unauthorized","message"=>"Invalid Authorization header format"]);
            exit;
        }

        $token = trim($matches[1]);
        if (empty($token)) {
            http_response_code(401);
            echo json_encode(["error"=>"Unauthorized","message"=>"Token cannot be empty"]);
            exit;
        }

        try {
            $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));

            if (!isset($decoded->data)) {
                http_response_code(401);
                echo json_encode(["error"=>"Unauthorized","message"=>"Invalid token structure"]);
                exit;
            }

            $user = (array)$decoded->data;

            if (!isset($user['id'])) {
                http_response_code(401);
                echo json_encode(["error"=>"Unauthorized","message"=>"Invalid token data"]);
                exit;
            }

            // ✅ Return user id for sync.php
            // return intval($user['id']);
             return (array) $decoded->data;

        } catch (ExpiredException $e) {
            http_response_code(401);
            echo json_encode(["error"=>"Unauthorized","message"=>"Token has expired"]);
            exit;
        } catch (Exception $e) {
            error_log("JWT decode error: " . $e->getMessage());
            http_response_code(401);
            echo json_encode(["error"=>"Unauthorized","message"=>"Invalid token"]);
            exit;
        }
    }
?>