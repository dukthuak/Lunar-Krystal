<?php
// Database configuration for Lunar Krystal Bot website
class Database {
    private $host = 'localhost';
    private $dbname = 'lunarkrystal_bot';
    private $username = 'root';
    private $password = '';
    private $charset = 'utf8mb4';
    private $pdo;
    
    public function __construct() {
        $this->connect();
    }
    
    private function connect() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset={$this->charset}";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->pdo = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage(), (int)$e->getCode());
        }
    }
    
    public function getConnection() {
        return $this->pdo;
    }
    
    public function createTables() {
        $tables = [
            'contact_requests' => "
                CREATE TABLE IF NOT EXISTS contact_requests (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    thread_id VARCHAR(255),
                    package VARCHAR(50) NOT NULL,
                    message TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status ENUM('pending', 'contacted', 'completed') DEFAULT 'pending',
                    admin_notes TEXT,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            ",
            'bot_rentals' => "
                CREATE TABLE IF NOT EXISTS bot_rentals (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_name VARCHAR(255) NOT NULL,
                    thread_id VARCHAR(255) NOT NULL,
                    package VARCHAR(50) NOT NULL,
                    start_date DATE NOT NULL,
                    end_date DATE,
                    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            ",
            'admin_users' => "
                CREATE TABLE IF NOT EXISTS admin_users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(100) NOT NULL UNIQUE,
                    password_hash VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    role ENUM('admin', 'moderator') DEFAULT 'moderator',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_login TIMESTAMP NULL
                )
            "
        ];
        
        foreach ($tables as $table_name => $sql) {
            try {
                $this->pdo->exec($sql);
                echo "Table $table_name created successfully.\n";
            } catch (PDOException $e) {
                echo "Error creating table $table_name: " . $e->getMessage() . "\n";
            }
        }
    }
    
    public function insertContactRequest($data) {
        $sql = "INSERT INTO contact_requests (name, thread_id, package, message) VALUES (?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['name'],
            $data['thread_id'],
            $data['package'],
            $data['message']
        ]);
    }
    
    public function getContactRequests($status = null) {
        $sql = "SELECT * FROM contact_requests";
        if ($status) {
            $sql .= " WHERE status = ?";
        }
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $this->pdo->prepare($sql);
        if ($status) {
            $stmt->execute([$status]);
        } else {
            $stmt->execute();
        }
        
        return $stmt->fetchAll();
    }
    
    public function updateContactRequestStatus($id, $status, $admin_notes = null) {
        $sql = "UPDATE contact_requests SET status = ?, admin_notes = ? WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$status, $admin_notes, $id]);
    }
    
    public function getActiveRentals() {
        $sql = "SELECT * FROM bot_rentals WHERE status = 'active' AND end_date > CURDATE()";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function createRental($data) {
        $sql = "INSERT INTO bot_rentals (user_name, thread_id, package, start_date, end_date) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['user_name'],
            $data['thread_id'],
            $data['package'],
            $data['start_date'],
            $data['end_date']
        ]);
    }
}
?>
