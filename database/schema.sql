CREATE DATABASE IF NOT EXISTS pet_adoption;
USE pet_adoption;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('adopter', 'provider') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(100) NOT NULL,
  breed VARCHAR(255) DEFAULT NULL,
  age INT DEFAULT NULL,
  gender ENUM('male', 'female') DEFAULT NULL,
  location VARCHAR(255) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  image VARCHAR(255) DEFAULT NULL,
  status ENUM('available', 'adopted') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS adoption_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pet_id INT NOT NULL,
  adopter_id INT NOT NULL,
  message TEXT NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  city VARCHAR(100) NOT NULL,
  owned_pet_before ENUM('yes', 'no') NOT NULL,
  housing_type ENUM('apartment', 'independent_house', 'farm_rural_property') NOT NULL,
  response_message TEXT DEFAULT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
  FOREIGN KEY (adopter_id) REFERENCES users(id) ON DELETE CASCADE
);
