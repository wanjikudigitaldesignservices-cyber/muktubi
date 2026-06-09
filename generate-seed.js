import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const centers = [
  { id: uuidv4(), name: 'MOHI Mathare North', location: 'Mathare, Nairobi', region: 'Nairobi', total_books: 1200, active_members: 450 },
  { id: uuidv4(), name: 'MOHI Kibera', location: 'Kibera, Nairobi', region: 'Nairobi', total_books: 850, active_members: 320 },
  { id: uuidv4(), name: 'MOHI Joska', location: 'Joska, Machakos', region: 'Eastern', total_books: 2100, active_members: 850 },
  { id: uuidv4(), name: 'MOHI Turkana', location: 'Lodwar, Turkana', region: 'Rift Valley', total_books: 400, active_members: 150 },
];

const books = [
  { id: uuidv4(), isbn: '9780435905255', title: 'Things Fall Apart', author: 'Chinua Achebe', description: 'A classic novel of African literature.', category: 'Fiction', target_audience: 'High School', reading_level: 'Advanced', total_copies: 15 },
  { id: uuidv4(), isbn: '9780142407332', title: 'Matilda', author: 'Roald Dahl', description: 'A story about a brilliant girl with magical powers.', category: 'Fiction', target_audience: 'Primary', reading_level: 'Intermediate', total_copies: 10 },
  { id: uuidv4(), isbn: '9780064404990', title: "Charlotte's Web", author: 'E.B. White', description: 'A tale of friendship between a pig and a spider.', category: 'Fiction', target_audience: 'Primary', reading_level: 'Beginner', total_copies: 8 },
  { id: uuidv4(), isbn: '9780141345659', title: 'The Boy Who Harnessed the Wind', author: 'William Kamkwamba', description: 'A true story of a Malawian boy who builds a windmill.', category: 'Biography', target_audience: 'Middle School', reading_level: 'Intermediate', total_copies: 5 },
  { id: uuidv4(), isbn: '9781338878929', title: "Harry Potter and the Sorcerer's Stone", author: 'J.K. Rowling', description: 'A young boy discovers he is a wizard.', category: 'Fantasy', target_audience: 'Middle School', reading_level: 'Intermediate', total_copies: 20 }
];

let sql = `-- MUKTUBI Seed Data\n\n`;

// Centers
sql += `-- CENTERS\n`;
centers.forEach(c => {
  sql += `INSERT INTO centers (id, name, location, region, total_books, active_members) VALUES ('${c.id}', '${c.name}', '${c.location}', '${c.region}', ${c.total_books}, ${c.active_members});\n`;
});

sql += `\n-- BOOKS\n`;
books.forEach(b => {
  sql += `INSERT INTO books (id, isbn, title, author, description, category, target_audience, reading_level, total_copies, available_copies) VALUES ('${b.id}', '${b.isbn}', '${b.title.replace(/'/g, "''")}', '${b.author.replace(/'/g, "''")}', '${b.description.replace(/'/g, "''")}', '${b.category}', '${b.target_audience}', '${b.reading_level}', ${b.total_copies}, ${b.total_copies});\n`;
});

sql += `\n-- BOOK COPIES\n`;
books.forEach(b => {
  // Generate a few copies for the first center
  for (let i = 0; i < 3; i++) {
    const copyId = uuidv4();
    const barcode = \`MOHI-\${b.isbn.slice(-4)}-\${i+1}\`;
    sql += \`INSERT INTO book_copies (id, book_id, center_id, barcode) VALUES ('\${copyId}', '\${b.id}', '\${centers[0].id}', '\${barcode}');\n\`;
  }
});

fs.writeFileSync('supabase/seed.sql', sql);
console.log('Generated supabase/seed.sql');
