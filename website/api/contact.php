<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate required fields
$required_fields = ['name', 'package'];
foreach ($required_fields as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        http_response_code(400);
        echo json_encode(['error' => "Field '$field' is required"]);
        exit();
    }
}

// Sanitize input data
$name = htmlspecialchars(trim($data['name']));
$threadId = isset($data['threadId']) ? htmlspecialchars(trim($data['threadId'])) : '';
$package = htmlspecialchars(trim($data['package']));
$message = isset($data['message']) ? htmlspecialchars(trim($data['message'])) : '';

// Validate package selection
$valid_packages = ['free', 'premium', 'enterprise'];
if (!in_array($package, $valid_packages)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid package selection']);
    exit();
}

// Get package name in Vietnamese
$package_names = [
    'free' => 'Gói Miễn Phí',
    'premium' => 'Gói Premium',
    'enterprise' => 'Gói Enterprise'
];

$package_name = $package_names[$package];

// Create email content
$email_subject = "Yêu cầu thuê bot - $package_name từ $name";
$email_body = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #6366f1; }
        .value { margin-top: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>🤖 Yêu cầu thuê Lunar Krystal Bot</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>👤 Tên người dùng:</div>
                <div class='value'>$name</div>
            </div>
            
            <div class='field'>
                <div class='label'>📦 Gói thuê:</div>
                <div class='value'>$package_name</div>
            </div>
            
            <div class='field'>
                <div class='label'>🆔 ID nhóm Facebook:</div>
                <div class='value'>" . ($threadId ? $threadId : 'Không cung cấp') . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>💬 Tin nhắn:</div>
                <div class='value'>" . ($message ? $message : 'Không có tin nhắn') . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>⏰ Thời gian:</div>
                <div class='value'>" . date('d/m/Y H:i:s') . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>Email này được gửi từ website Lunar Krystal Bot</p>
        </div>
    </div>
</body>
</html>
";

// Email configuration
$to = "dukthuak@gmail.com"; // Thay đổi email của bạn
$from = "noreply@lunarkrystalbot.com";
$headers = [
    "MIME-Version: 1.0",
    "Content-type: text/html; charset=UTF-8",
    "From: $from",
    "Reply-To: $from",
    "X-Mailer: PHP/" . phpversion()
];

// Send email
$mail_sent = mail($to, $email_subject, $email_body, implode("\r\n", $headers));

// Save to database (optional)
try {
    // Database configuration
    $host = 'localhost';
    $dbname = 'lunarkrystal_bot';
    $username = 'root';
    $password = '';
    
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create table if not exists
    $create_table = "
        CREATE TABLE IF NOT EXISTS contact_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            thread_id VARCHAR(255),
            package VARCHAR(50) NOT NULL,
            message TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status ENUM('pending', 'contacted', 'completed') DEFAULT 'pending'
        )
    ";
    $pdo->exec($create_table);
    
    // Insert request
    $stmt = $pdo->prepare("
        INSERT INTO contact_requests (name, thread_id, package, message) 
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([$name, $threadId, $package, $message]);
    
} catch (PDOException $e) {
    // Log error but don't fail the request
    error_log("Database error: " . $e->getMessage());
}

// Send notification to Facebook (optional)
if ($threadId && !empty($threadId)) {
    // Here you can add code to send notification to the bot
    // For example, using webhook or direct API call
    $bot_notification = [
        'thread_id' => $threadId,
        'message' => "✅ Yêu cầu thuê bot của bạn đã được gửi thành công!\n📦 Gói: $package_name\n👤 Tên: $name\n⏰ Thời gian: " . date('d/m/Y H:i:s') . "\n\nChúng tôi sẽ liên hệ với bạn sớm nhất có thể!"
    ];
    
    // You can implement webhook call here
    // sendToBot($bot_notification);
}

// Response
if ($mail_sent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Yêu cầu đã được gửi thành công!',
        'data' => [
            'name' => $name,
            'package' => $package_name,
            'thread_id' => $threadId,
            'timestamp' => date('d/m/Y H:i:s')
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Không thể gửi email. Vui lòng thử lại sau.'
    ]);
}

// Function to send notification to bot (implement as needed)
function sendToBot($data) {
    // Example webhook implementation
    $webhook_url = "https://your-bot-domain.com/webhook/contact";
    
    $options = [
        'http' => [
            'header' => "Content-type: application/json\r\n",
            'method' => 'POST',
            'content' => json_encode($data)
        ]
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents($webhook_url, false, $context);
    
    return $result !== false;
}
?>
