-- MUKTUBI Seed Data

-- CENTERS
INSERT INTO centers (id, name, location, region, total_books, active_members) VALUES ('123e4567-e89b-12d3-a456-426614174000', 'MOHI Mathare North', 'Mathare, Nairobi', 'Nairobi', 1200, 450);
INSERT INTO centers (id, name, location, region, total_books, active_members) VALUES ('123e4567-e89b-12d3-a456-426614174001', 'MOHI Kibera', 'Kibera, Nairobi', 'Nairobi', 850, 320);
INSERT INTO centers (id, name, location, region, total_books, active_members) VALUES ('123e4567-e89b-12d3-a456-426614174002', 'MOHI Joska', 'Joska, Machakos', 'Eastern', 2100, 850);
INSERT INTO centers (id, name, location, region, total_books, active_members) VALUES ('123e4567-e89b-12d3-a456-426614174003', 'MOHI Turkana', 'Lodwar, Turkana', 'Rift Valley', 400, 150);

-- BOOKS
INSERT INTO books (id, isbn, title, author, description, category, target_audience, reading_level, total_copies, available_copies) VALUES ('223e4567-e89b-12d3-a456-426614174000', '9780435905255', 'Things Fall Apart', 'Chinua Achebe', 'A classic novel of African literature.', 'Fiction', 'High School', 'Advanced', 15, 15);
INSERT INTO books (id, isbn, title, author, description, category, target_audience, reading_level, total_copies, available_copies) VALUES ('223e4567-e89b-12d3-a456-426614174001', '9780142407332', 'Matilda', 'Roald Dahl', 'A story about a brilliant girl with magical powers.', 'Fiction', 'Primary', 'Intermediate', 10, 10);
INSERT INTO books (id, isbn, title, author, description, category, target_audience, reading_level, total_copies, available_copies) VALUES ('223e4567-e89b-12d3-a456-426614174002', '9780064404990', 'Charlotte''s Web', 'E.B. White', 'A tale of friendship between a pig and a spider.', 'Fiction', 'Primary', 'Beginner', 8, 8);
INSERT INTO books (id, isbn, title, author, description, category, target_audience, reading_level, total_copies, available_copies) VALUES ('223e4567-e89b-12d3-a456-426614174003', '9780141345659', 'The Boy Who Harnessed the Wind', 'William Kamkwamba', 'A true story of a Malawian boy who builds a windmill.', 'Biography', 'Middle School', 'Intermediate', 5, 5);
INSERT INTO books (id, isbn, title, author, description, category, target_audience, reading_level, total_copies, available_copies) VALUES ('223e4567-e89b-12d3-a456-426614174004', '9781338878929', 'Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'A young boy discovers he is a wizard.', 'Fantasy', 'Middle School', 'Intermediate', 20, 20);

-- BOOK COPIES
INSERT INTO book_copies (id, book_id, center_id, barcode) VALUES ('323e4567-e89b-12d3-a456-426614174000', '223e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', 'MOHI-5255-1');
INSERT INTO book_copies (id, book_id, center_id, barcode) VALUES ('323e4567-e89b-12d3-a456-426614174001', '223e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', 'MOHI-5255-2');
INSERT INTO book_copies (id, book_id, center_id, barcode) VALUES ('323e4567-e89b-12d3-a456-426614174002', '223e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', 'MOHI-7332-1');
INSERT INTO book_copies (id, book_id, center_id, barcode) VALUES ('323e4567-e89b-12d3-a456-426614174003', '223e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', 'MOHI-7332-2');
INSERT INTO book_copies (id, book_id, center_id, barcode) VALUES ('323e4567-e89b-12d3-a456-426614174004', '223e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174000', 'MOHI-4990-1');
