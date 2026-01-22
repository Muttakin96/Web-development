<?php
    require_once __DIR__ . "/auth.php"; // should define authenticate() function

    $user = authenticate(); // returns logged-in user info
    var_dump($user);

    // echo "Hello world";

    if (!isset($user) || !is_array($user)) {
        http_response_code(401);
        echo json_encode(["error" => "Authentication required"]);
        exit;
    }

    // echo "Hello world";

    // Check for admin role
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(["error" => "Admin access required"]);
        exit;
    }
   
?>