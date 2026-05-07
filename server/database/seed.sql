USE team_task_manager;

-- Insert sample users (passwords are hashed 'password123')
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2b$10$YourHashedPasswordHere', 'admin'),
('John Doe', 'john@example.com', '$2b$10$YourHashedPasswordHere', 'member'),
('Jane Smith', 'jane@example.com', '$2b$10$YourHashedPasswordHere', 'member');

-- Note: In production, you'll create users through the API which will hash passwords automatically