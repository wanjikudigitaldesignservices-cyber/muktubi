// ============================================================
// MUKTUBI — Demo/Seed Data
// Realistic data for all 38 MOHI centers, 50 books, members, loans
// Used both for Supabase seeding and local demo mode
// ============================================================

import type {
  Center, Profile, Book, BookCopy, Loan,
  Reservation, ReadingLog, AIRecommendation
} from './types';

// ---- 38 MOHI Centers ----
export const DEMO_CENTERS: Center[] = [
  { id: 'c001', name: 'MOHI Mathare', location: 'Mathare, Nairobi', region: 'Nairobi', total_books: 342, active_members: 287, created_at: '2024-01-15' },
  { id: 'c002', name: 'MOHI Kibera', location: 'Kibera, Nairobi', region: 'Nairobi', total_books: 410, active_members: 312, created_at: '2024-01-15' },
  { id: 'c003', name: 'MOHI Pangani', location: 'Pangani, Nairobi', region: 'Nairobi', total_books: 198, active_members: 156, created_at: '2024-02-01' },
  { id: 'c004', name: 'MOHI Kariobangi', location: 'Kariobangi, Nairobi', region: 'Nairobi', total_books: 275, active_members: 234, created_at: '2024-02-01' },
  { id: 'c005', name: 'MOHI Huruma', location: 'Huruma, Nairobi', region: 'Nairobi', total_books: 320, active_members: 198, created_at: '2024-02-15' },
  { id: 'c006', name: 'MOHI Kayole', location: 'Kayole, Nairobi', region: 'Nairobi', total_books: 185, active_members: 167, created_at: '2024-03-01' },
  { id: 'c007', name: 'MOHI Dandora', location: 'Dandora, Nairobi', region: 'Nairobi', total_books: 256, active_members: 201, created_at: '2024-03-01' },
  { id: 'c008', name: 'MOHI Korogocho', location: 'Korogocho, Nairobi', region: 'Nairobi', total_books: 198, active_members: 178, created_at: '2024-03-15' },
  { id: 'c009', name: 'MOHI Kawangware', location: 'Kawangware, Nairobi', region: 'Nairobi', total_books: 167, active_members: 145, created_at: '2024-04-01' },
  { id: 'c010', name: 'MOHI Mukuru', location: 'Mukuru, Nairobi', region: 'Nairobi', total_books: 289, active_members: 223, created_at: '2024-04-01' },
  { id: 'c011', name: 'MOHI Githurai', location: 'Githurai 45, Nairobi', region: 'Nairobi', total_books: 213, active_members: 189, created_at: '2024-04-15' },
  { id: 'c012', name: 'MOHI Pipeline', location: 'Pipeline, Nairobi', region: 'Nairobi', total_books: 178, active_members: 156, created_at: '2024-05-01' },
  { id: 'c013', name: 'MOHI Ruiru', location: 'Ruiru, Kiambu', region: 'Central', total_books: 234, active_members: 198, created_at: '2024-05-01' },
  { id: 'c014', name: 'MOHI Juja', location: 'Juja, Kiambu', region: 'Central', total_books: 156, active_members: 134, created_at: '2024-05-15' },
  { id: 'c015', name: 'MOHI Thika', location: 'Thika, Kiambu', region: 'Central', total_books: 298, active_members: 245, created_at: '2024-06-01' },
  { id: 'c016', name: 'MOHI Mombasa Central', location: 'Mombasa Island', region: 'Coast', total_books: 312, active_members: 267, created_at: '2024-06-01' },
  { id: 'c017', name: 'MOHI Likoni', location: 'Likoni, Mombasa', region: 'Coast', total_books: 189, active_members: 156, created_at: '2024-06-15' },
  { id: 'c018', name: 'MOHI Changamwe', location: 'Changamwe, Mombasa', region: 'Coast', total_books: 167, active_members: 134, created_at: '2024-07-01' },
  { id: 'c019', name: 'MOHI Kisumu', location: 'Kisumu City', region: 'Nyanza', total_books: 278, active_members: 234, created_at: '2024-07-01' },
  { id: 'c020', name: 'MOHI Kondele', location: 'Kondele, Kisumu', region: 'Nyanza', total_books: 145, active_members: 123, created_at: '2024-07-15' },
  { id: 'c021', name: 'MOHI Nakuru', location: 'Nakuru Town', region: 'Rift Valley', total_books: 267, active_members: 212, created_at: '2024-08-01' },
  { id: 'c022', name: 'MOHI Naivasha', location: 'Naivasha, Nakuru', region: 'Rift Valley', total_books: 178, active_members: 145, created_at: '2024-08-01' },
  { id: 'c023', name: 'MOHI Eldoret', location: 'Eldoret Town', region: 'Rift Valley', total_books: 234, active_members: 198, created_at: '2024-08-15' },
  { id: 'c024', name: 'MOHI Kitale', location: 'Kitale, Trans-Nzoia', region: 'Rift Valley', total_books: 156, active_members: 123, created_at: '2024-09-01' },
  { id: 'c025', name: 'MOHI Nyeri', location: 'Nyeri Town', region: 'Central', total_books: 198, active_members: 167, created_at: '2024-09-01' },
  { id: 'c026', name: 'MOHI Embu', location: 'Embu Town', region: 'Eastern', total_books: 145, active_members: 112, created_at: '2024-09-15' },
  { id: 'c027', name: 'MOHI Meru', location: 'Meru Town', region: 'Eastern', total_books: 178, active_members: 145, created_at: '2024-10-01' },
  { id: 'c028', name: 'MOHI Machakos', location: 'Machakos Town', region: 'Eastern', total_books: 167, active_members: 134, created_at: '2024-10-01' },
  { id: 'c029', name: 'MOHI Kajiado', location: 'Kajiado Town', region: 'Rift Valley', total_books: 123, active_members: 98, created_at: '2024-10-15' },
  { id: 'c030', name: 'MOHI Narok', location: 'Narok Town', region: 'Rift Valley', total_books: 112, active_members: 89, created_at: '2024-11-01' },
  { id: 'c031', name: 'MOHI Malindi', location: 'Malindi, Kilifi', region: 'Coast', total_books: 145, active_members: 112, created_at: '2024-11-01' },
  { id: 'c032', name: 'MOHI Garissa', location: 'Garissa Town', region: 'North Eastern', total_books: 98, active_members: 78, created_at: '2024-11-15' },
  { id: 'c033', name: 'MOHI Nanyuki', location: 'Nanyuki, Laikipia', region: 'Central', total_books: 156, active_members: 123, created_at: '2024-12-01' },
  { id: 'c034', name: 'MOHI Kangemi', location: 'Kangemi, Nairobi', region: 'Nairobi', total_books: 189, active_members: 156, created_at: '2025-01-01' },
  { id: 'c035', name: 'MOHI Eastleigh', location: 'Eastleigh, Nairobi', region: 'Nairobi', total_books: 201, active_members: 178, created_at: '2025-01-15' },
  { id: 'c036', name: 'MOHI Umoja', location: 'Umoja, Nairobi', region: 'Nairobi', total_books: 234, active_members: 189, created_at: '2025-02-01' },
  { id: 'c037', name: 'MOHI Embakasi', location: 'Embakasi, Nairobi', region: 'Nairobi', total_books: 178, active_members: 145, created_at: '2025-02-15' },
  { id: 'c038', name: 'MOHI Satellite', location: 'Satellite, Nairobi', region: 'Nairobi', total_books: 156, active_members: 123, created_at: '2025-03-01' },
];

// ---- 50 Sample Books ----
export const DEMO_BOOKS: Book[] = [
  // English Fiction (10)
  { id: 'b001', title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '978-0-385-47454-2', cover_url: null, description: 'The story of Okonkwo, a leader and local wrestling champion in a fictional Nigerian clan.', category: 'English Fiction', subject: 'Literature', language: 'English', reading_level: 'Grade 7', grade_range: '6-8', publisher: 'Heinemann', published_year: 1958, ai_summary: 'A powerful novel about the collision of African and European cultures in colonial Nigeria.', ai_tags: ['African Literature', 'Colonial History', 'Culture'], created_at: '2024-01-15' },
  { id: 'b002', title: 'The River Between', author: 'Ngũgĩ wa Thiong\'o', isbn: '978-0-435-90548-4', cover_url: null, description: 'A story of two ridges and their conflicting values during British colonialism in Kenya.', category: 'English Fiction', subject: 'Literature', language: 'English', reading_level: 'Grade 7', grade_range: '6-8', publisher: 'Heinemann', published_year: 1965, ai_summary: 'An exploration of cultural identity and colonialism set in the Kenyan highlands.', ai_tags: ['Kenyan Literature', 'Identity', 'Colonialism'], created_at: '2024-01-15' },
  { id: 'b003', title: 'Charlotte\'s Web', author: 'E.B. White', isbn: '978-0-06-093546-1', cover_url: null, description: 'The tale of a pig named Wilbur and his friendship with a barn spider named Charlotte.', category: 'English Fiction', subject: 'Literature', language: 'English', reading_level: 'Grade 3', grade_range: '2-4', publisher: 'Harper & Brothers', published_year: 1952, ai_summary: 'A heartwarming children\'s classic about friendship, sacrifice, and the cycle of life.', ai_tags: ['Friendship', 'Animals', 'Children\'s Classic'], created_at: '2024-01-15' },
  { id: 'b004', title: 'Matilda', author: 'Roald Dahl', isbn: '978-0-14-241037-0', cover_url: null, description: 'A brilliant little girl discovers she has extraordinary powers.', category: 'English Fiction', subject: 'Literature', language: 'English', reading_level: 'Grade 4', grade_range: '3-5', publisher: 'Jonathan Cape', published_year: 1988, ai_summary: 'A delightful story about a gifted child who overcomes her neglectful parents and cruel headmistress.', ai_tags: ['Empowerment', 'Magic', 'Childhood'], created_at: '2024-01-20' },
  { id: 'b005', title: 'Treasure Island', author: 'Robert Louis Stevenson', isbn: '978-0-14-062009-4', cover_url: null, description: 'Young Jim Hawkins finds a treasure map and sets sail on a thrilling adventure.', category: 'English Fiction', subject: 'Literature', language: 'English', reading_level: 'Grade 5', grade_range: '4-6', publisher: 'Cassell and Company', published_year: 1883, ai_summary: 'A swashbuckling adventure of pirates, buried treasure, and bravery on the high seas.', ai_tags: ['Adventure', 'Pirates', 'Classic'], created_at: '2024-02-01' },
  { id: 'b006', title: 'The Lion, the Witch and the Wardrobe', author: 'C.S. Lewis', isbn: '978-0-06-023481-2', cover_url: null, description: 'Four siblings discover a magical land through an old wardrobe.', category: 'English Fiction', subject: 'Literature', language: 'English', reading_level: 'Grade 4', grade_range: '3-6', publisher: 'Geoffrey Bles', published_year: 1950, ai_summary: 'An enchanting fantasy about good vs evil in the magical world of Narnia.', ai_tags: ['Fantasy', 'Adventure', 'Christian Allegory'], created_at: '2024-02-01' },
  { id: 'b007', title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling', isbn: '978-0-7475-3269-9', cover_url: null, description: 'A young orphan discovers he is a wizard and enters a magical world.', category: 'English Fiction', subject: 'Literature', language: 'English', reading_level: 'Grade 5', grade_range: '4-7', publisher: 'Bloomsbury', published_year: 1997, ai_summary: 'The magical beginning of Harry Potter\'s journey at Hogwarts School of Witchcraft and Wizardry.', ai_tags: ['Fantasy', 'Magic', 'Coming of Age'], created_at: '2024-02-15' },
  { id: 'b008', title: 'A Wrinkle in Time', author: 'Madeleine L\'Engle', isbn: '978-0-374-38613-9', cover_url: null, description: 'Meg Murry and friends travel through space and time to rescue her father.', category: 'English Fiction', subject: 'Literature', language: 'English', reading_level: 'Grade 5', grade_range: '4-6', publisher: 'Farrar, Straus & Giroux', published_year: 1962, ai_summary: 'A science-fantasy adventure about love, courage, and the battle against conformity.', ai_tags: ['Science Fiction', 'Adventure', 'Family'], created_at: '2024-03-01' },
  { id: 'b009', title: 'The Secret Garden', author: 'Frances Hodgson Burnett', isbn: '978-0-14-118271-5', cover_url: null, description: 'A spoiled orphan girl discovers a hidden garden and the healing power of nature.', category: 'English Fiction', subject: 'Literature', language: 'English', reading_level: 'Grade 4', grade_range: '3-5', publisher: 'Frederick A. Stokes', published_year: 1911, ai_summary: 'A transformative story about nature\'s healing power and the renewal of the human spirit.', ai_tags: ['Nature', 'Healing', 'Classic'], created_at: '2024-03-01' },
  { id: 'b010', title: 'Roll of Thunder, Hear My Cry', author: 'Mildred D. Taylor', isbn: '978-0-14-038451-1', cover_url: null, description: 'The Logan family struggles to maintain their dignity and land during the Great Depression.', category: 'English Fiction', subject: 'Literature', language: 'English', reading_level: 'Grade 6', grade_range: '5-8', publisher: 'Dial Press', published_year: 1976, ai_summary: 'A powerful story of racial injustice, family strength, and courage in 1930s Mississippi.', ai_tags: ['Social Justice', 'Family', 'History'], created_at: '2024-03-15' },

  // Swahili Literature (8)
  { id: 'b011', title: 'Siku Njema', author: 'Ken Walibora', isbn: '978-9966-46-856-1', cover_url: null, description: 'Hadithi ya Kongowea Musomi na safari yake ya maisha.', category: 'Swahili Literature', subject: 'Fasihi', language: 'Swahili', reading_level: 'Grade 6', grade_range: '5-8', publisher: 'Longhorn', published_year: 1996, ai_summary: 'Riwaya maarufu ya Kiswahili kuhusu maisha ya kijana anayejitahidi kushinda changamoto.', ai_tags: ['Riwaya', 'Maisha', 'Kenya'], created_at: '2024-01-15' },
  { id: 'b012', title: 'Kidagaa Kimemwozea', author: 'Ken Walibora', isbn: '978-9966-46-870-7', cover_url: null, description: 'Riwaya inayosimulia maisha ya watu wa jamii ya chini.', category: 'Swahili Literature', subject: 'Fasihi', language: 'Swahili', reading_level: 'Grade 7', grade_range: '6-8', publisher: 'Longhorn', published_year: 2012, ai_summary: 'Hadithi ya kusisimua kuhusu mapambano ya kijana dhidi ya udhalimu.', ai_tags: ['Riwaya', 'Haki', 'Jamii'], created_at: '2024-01-15' },
  { id: 'b013', title: 'Kamusi ya Kiswahili Sanifu', author: 'TUKI', isbn: '978-9976-911-10-0', cover_url: null, description: 'Kamusi rasmi ya Kiswahili.', category: 'Swahili Literature', subject: 'Lugha', language: 'Swahili', reading_level: 'Grade 3', grade_range: '1-8', publisher: 'Oxford University Press', published_year: 2004, ai_summary: 'Kamusi kamili ya Kiswahili kwa wanafunzi na wasomaji wote.', ai_tags: ['Kamusi', 'Lugha', 'Rejea'], created_at: '2024-02-01' },
  { id: 'b014', title: 'Mashairi ya Kiswahili', author: 'Various Authors', isbn: '978-9966-00-230-5', cover_url: null, description: 'Mkusanyiko wa mashairi mbalimbali ya Kiswahili.', category: 'Swahili Literature', subject: 'Ushairi', language: 'Swahili', reading_level: 'Grade 5', grade_range: '4-8', publisher: 'East African Publishers', published_year: 2010, ai_summary: 'Mkusanyiko wa mashairi ya kuvutia yanayoonyesha utamaduni wa Afrika Mashariki.', ai_tags: ['Ushairi', 'Utamaduni', 'Fasihi'], created_at: '2024-02-15' },
  { id: 'b015', title: 'Kicheko cha Ushindi', author: 'Wallah Bin Wallah', isbn: '978-9966-46-890-5', cover_url: null, description: 'Hadithi za kuchekesha na za kufundisha.', category: 'Swahili Literature', subject: 'Fasihi', language: 'Swahili', reading_level: 'Grade 3', grade_range: '2-4', publisher: 'Longhorn', published_year: 2008, ai_summary: 'Hadithi fupi za kuchekesha zinazofaa kwa watoto wa shule ya msingi.', ai_tags: ['Hadithi Fupi', 'Ucheshi', 'Watoto'], created_at: '2024-03-01' },
  { id: 'b016', title: 'Nguzo Mama', author: 'Emmanuel Mbogo', isbn: '978-9966-46-910-0', cover_url: null, description: 'Tamthilia kuhusu nafasi ya mama katika jamii.', category: 'Swahili Literature', subject: 'Tamthilia', language: 'Swahili', reading_level: 'Grade 7', grade_range: '6-8', publisher: 'Longhorn', published_year: 2015, ai_summary: 'Tamthilia ya kusisimua kuhusu nguvu na ujasiri wa mama katika jamii ya kisasa.', ai_tags: ['Tamthilia', 'Wanawake', 'Jamii'], created_at: '2024-03-15' },
  { id: 'b017', title: 'Hadithi za Watoto', author: 'Mwalimu Julius Nyerere', isbn: '978-9976-00-105-2', cover_url: null, description: 'Mkusanyiko wa hadithi za jadi za Afrika Mashariki.', category: 'Swahili Literature', subject: 'Fasihi', language: 'Swahili', reading_level: 'Grade 2', grade_range: '1-3', publisher: 'Mkuki na Nyota', published_year: 1990, ai_summary: 'Hadithi za jadi za kusisimua zilizotafsiriwa kwa lugha rahisi kwa watoto.', ai_tags: ['Hadithi za Jadi', 'Watoto', 'Afrika Mashariki'], created_at: '2024-04-01' },
  { id: 'b018', title: 'Damu Nyeusi', author: 'Ken Walibora', isbn: '978-9966-46-920-9', cover_url: null, description: 'Riwaya ya upelelezi inayoshughulika na masuala ya kijamii.', category: 'Swahili Literature', subject: 'Fasihi', language: 'Swahili', reading_level: 'Grade 8', grade_range: '7-8', publisher: 'Longhorn', published_year: 2018, ai_summary: 'Riwaya ya kisasa inayochanganya upelelezi na masuala ya kijamii nchini Kenya.', ai_tags: ['Upelelezi', 'Jamii', 'Kenya'], created_at: '2024-04-15' },

  // Science (8)
  { id: 'b019', title: 'Our Bodies, Our Health', author: 'Dr. Sarah Kimani', isbn: '978-9966-25-100-1', cover_url: null, description: 'An introduction to human biology and health for young learners.', category: 'Science', subject: 'Biology', language: 'English', reading_level: 'Grade 4', grade_range: '3-5', publisher: 'KICD', published_year: 2020, ai_summary: 'An engaging guide to human biology covering body systems, nutrition, and hygiene.', ai_tags: ['Biology', 'Health', 'Human Body'], created_at: '2024-01-15' },
  { id: 'b020', title: 'Kenya\'s Amazing Wildlife', author: 'James Mwangi', isbn: '978-9966-25-110-0', cover_url: null, description: 'Discover the incredible wildlife of Kenya from savannahs to forests.', category: 'Science', subject: 'Ecology', language: 'English', reading_level: 'Grade 3', grade_range: '2-5', publisher: 'East African Publishers', published_year: 2019, ai_summary: 'A beautifully illustrated guide to Kenya\'s diverse ecosystems and wildlife.', ai_tags: ['Wildlife', 'Kenya', 'Ecology'], created_at: '2024-02-01' },
  { id: 'b021', title: 'Fun with Experiments', author: 'Prof. Otieno Wambui', isbn: '978-9966-25-120-9', cover_url: null, description: 'Simple science experiments that can be done with everyday materials.', category: 'Science', subject: 'General Science', language: 'English', reading_level: 'Grade 4', grade_range: '3-6', publisher: 'Oxford University Press', published_year: 2021, ai_summary: 'Hands-on science experiments designed for young scientists using everyday household items.', ai_tags: ['Experiments', 'STEM', 'Hands-on Learning'], created_at: '2024-02-15' },
  { id: 'b022', title: 'The Solar System for Kids', author: 'Maria Njeri', isbn: '978-9966-25-130-8', cover_url: null, description: 'An illustrated journey through our solar system.', category: 'Science', subject: 'Astronomy', language: 'English', reading_level: 'Grade 3', grade_range: '2-4', publisher: 'Longhorn', published_year: 2022, ai_summary: 'A colorful exploration of planets, moons, and space phenomena for young learners.', ai_tags: ['Space', 'Planets', 'Astronomy'], created_at: '2024-03-01' },
  { id: 'b023', title: 'Water: Our Precious Resource', author: 'Grace Akinyi', isbn: '978-9966-25-140-7', cover_url: null, description: 'Understanding water cycles, conservation, and access in East Africa.', category: 'Science', subject: 'Environmental Science', language: 'English', reading_level: 'Grade 5', grade_range: '4-6', publisher: 'KICD', published_year: 2021, ai_summary: 'An essential guide to understanding water resources and conservation in the African context.', ai_tags: ['Water', 'Conservation', 'Environment'], created_at: '2024-03-15' },
  { id: 'b024', title: 'Introduction to Computing', author: 'Peter Odhiambo', isbn: '978-9966-25-150-6', cover_url: null, description: 'Basic computing concepts for primary school students.', category: 'Science', subject: 'Computer Science', language: 'English', reading_level: 'Grade 5', grade_range: '4-7', publisher: 'Oxford University Press', published_year: 2023, ai_summary: 'A beginner-friendly introduction to computers, coding concepts, and digital literacy.', ai_tags: ['Computing', 'Digital Literacy', 'STEM'], created_at: '2024-04-01' },
  { id: 'b025', title: 'Plants Around Us', author: 'Dr. Flora Mutua', isbn: '978-9966-25-160-5', cover_url: null, description: 'Exploring the fascinating world of plants in Kenya.', category: 'Science', subject: 'Botany', language: 'English', reading_level: 'Grade 3', grade_range: '2-4', publisher: 'East African Publishers', published_year: 2020, ai_summary: 'A wonderful introduction to plant biology featuring common Kenyan plants and trees.', ai_tags: ['Plants', 'Botany', 'Kenya'], created_at: '2024-04-15' },
  { id: 'b026', title: 'Energy and Forces', author: 'Samuel Kiprop', isbn: '978-9966-25-170-4', cover_url: null, description: 'Understanding energy, motion, and forces in everyday life.', category: 'Science', subject: 'Physics', language: 'English', reading_level: 'Grade 6', grade_range: '5-8', publisher: 'Longhorn', published_year: 2022, ai_summary: 'A practical guide to physics concepts using real-world East African examples.', ai_tags: ['Physics', 'Energy', 'Forces'], created_at: '2024-05-01' },

  // Mathematics (6)
  { id: 'b027', title: 'Maths Made Easy: Grade 3-4', author: 'Agnes Wanjiku', isbn: '978-9966-30-100-1', cover_url: null, description: 'Fun and engaging mathematics for lower primary students.', category: 'Mathematics', subject: 'Mathematics', language: 'English', reading_level: 'Grade 3', grade_range: '3-4', publisher: 'KICD', published_year: 2021, ai_summary: 'A colorful, activity-based mathematics workbook for building strong number foundations.', ai_tags: ['Mathematics', 'Primary', 'Activities'], created_at: '2024-01-15' },
  { id: 'b028', title: 'Problem Solving Champions', author: 'David Kamau', isbn: '978-9966-30-110-0', cover_url: null, description: 'Challenging maths problems for upper primary students.', category: 'Mathematics', subject: 'Mathematics', language: 'English', reading_level: 'Grade 6', grade_range: '5-8', publisher: 'Longhorn', published_year: 2022, ai_summary: 'An excellent collection of challenging problems to develop critical mathematical thinking.', ai_tags: ['Problem Solving', 'Advanced Maths', 'Competition'], created_at: '2024-02-01' },
  { id: 'b029', title: 'Geometry Adventures', author: 'Mary Adhiambo', isbn: '978-9966-30-120-9', cover_url: null, description: 'Exploring shapes, patterns and spatial reasoning.', category: 'Mathematics', subject: 'Geometry', language: 'English', reading_level: 'Grade 4', grade_range: '3-5', publisher: 'Oxford University Press', published_year: 2020, ai_summary: 'A visual and interactive guide to geometry concepts through real-world patterns.', ai_tags: ['Geometry', 'Shapes', 'Visual Learning'], created_at: '2024-03-01' },
  { id: 'b030', title: 'Numbers in Our World', author: 'John Muthoni', isbn: '978-9966-30-130-8', cover_url: null, description: 'How mathematics connects to everyday life in Kenya.', category: 'Mathematics', subject: 'Applied Mathematics', language: 'English', reading_level: 'Grade 5', grade_range: '4-6', publisher: 'East African Publishers', published_year: 2021, ai_summary: 'Connecting mathematical concepts to real-world scenarios in Kenyan daily life.', ai_tags: ['Applied Maths', 'Real World', 'Kenya'], created_at: '2024-04-01' },
  { id: 'b031', title: 'Hesabu kwa Furaha', author: 'Mwalimu Habiba', isbn: '978-9966-30-140-7', cover_url: null, description: 'Kitabu cha hesabu kwa lugha ya Kiswahili.', category: 'Mathematics', subject: 'Hesabu', language: 'Swahili', reading_level: 'Grade 2', grade_range: '1-3', publisher: 'Longhorn', published_year: 2019, ai_summary: 'Kitabu bora cha hesabu kwa Kiswahili kinachofanya kujifunza kuwa furaha.', ai_tags: ['Hesabu', 'Kiswahili', 'Msingi'], created_at: '2024-05-01' },
  { id: 'b032', title: 'Mental Maths Mastery', author: 'Ruth Njoki', isbn: '978-9966-30-150-6', cover_url: null, description: 'Speed mathematics and mental calculation techniques.', category: 'Mathematics', subject: 'Mathematics', language: 'English', reading_level: 'Grade 5', grade_range: '4-7', publisher: 'KICD', published_year: 2023, ai_summary: 'Techniques and practice exercises for developing lightning-fast mental arithmetic skills.', ai_tags: ['Mental Maths', 'Speed', 'Practice'], created_at: '2024-06-01' },

  // Christian/Spiritual (6)
  { id: 'b033', title: 'Bible Stories for Children', author: 'Rev. Timothy Wafula', isbn: '978-9966-40-100-1', cover_url: null, description: 'Illustrated Bible stories retold for young readers.', category: 'Christian/Spiritual', subject: 'Religious Education', language: 'English', reading_level: 'Grade 2', grade_range: '1-3', publisher: 'Evangel Publishing House', published_year: 2018, ai_summary: 'Beautifully illustrated Bible stories made accessible for young learners.', ai_tags: ['Bible', 'Children', 'Faith'], created_at: '2024-01-15' },
  { id: 'b034', title: 'Psalms for Young Hearts', author: 'Sister Mary Achieng', isbn: '978-9966-40-110-0', cover_url: null, description: 'Selected Psalms with reflections for children and teens.', category: 'Christian/Spiritual', subject: 'Religious Education', language: 'English', reading_level: 'Grade 4', grade_range: '3-6', publisher: 'Paulines Publications', published_year: 2020, ai_summary: 'A thoughtful collection of Psalms with age-appropriate reflections and prayers.', ai_tags: ['Psalms', 'Devotion', 'Youth'], created_at: '2024-02-01' },
  { id: 'b035', title: 'Heroes of Faith in Africa', author: 'Bishop Daniel Muindi', isbn: '978-9966-40-120-9', cover_url: null, description: 'Stories of inspiring African Christians through history.', category: 'Christian/Spiritual', subject: 'Church History', language: 'English', reading_level: 'Grade 6', grade_range: '5-8', publisher: 'Evangel Publishing House', published_year: 2021, ai_summary: 'Inspiring biographies of African Christians who shaped the continent\'s spiritual heritage.', ai_tags: ['Biography', 'Africa', 'Faith'], created_at: '2024-03-01' },
  { id: 'b036', title: 'Hadithi za Biblia', author: 'Padri Joseph Kariuki', isbn: '978-9966-40-130-8', cover_url: null, description: 'Hadithi za Biblia kwa Kiswahili rahisi.', category: 'Christian/Spiritual', subject: 'Elimu ya Dini', language: 'Swahili', reading_level: 'Grade 2', grade_range: '1-3', publisher: 'Paulines Publications', published_year: 2019, ai_summary: 'Hadithi za Biblia zilizotafsiriwa kwa Kiswahili rahisi kwa watoto.', ai_tags: ['Biblia', 'Kiswahili', 'Watoto'], created_at: '2024-04-01' },
  { id: 'b037', title: 'Values for Life', author: 'Dr. Grace Mwangi', isbn: '978-9966-40-140-7', cover_url: null, description: 'Building character through Christian values and real-life stories.', category: 'Christian/Spiritual', subject: 'Character Education', language: 'English', reading_level: 'Grade 5', grade_range: '4-7', publisher: 'Oxford University Press', published_year: 2022, ai_summary: 'A practical guide to developing strong character through faith-based values and stories.', ai_tags: ['Values', 'Character', 'Faith'], created_at: '2024-05-01' },
  { id: 'b038', title: 'Prayer Journal for Kids', author: 'Pastor Hope Njeri', isbn: '978-9966-40-150-6', cover_url: null, description: 'An interactive prayer journal with guided prompts for children.', category: 'Christian/Spiritual', subject: 'Devotion', language: 'English', reading_level: 'Grade 3', grade_range: '2-5', publisher: 'Evangel Publishing House', published_year: 2023, ai_summary: 'An interactive journal to help children develop a meaningful prayer life.', ai_tags: ['Prayer', 'Journal', 'Children'], created_at: '2024-06-01' },

  // Social Studies (6)
  { id: 'b039', title: 'History of Kenya', author: 'Prof. Bethwell Ogot', isbn: '978-9966-50-100-1', cover_url: null, description: 'A comprehensive history of Kenya from pre-colonial times to independence.', category: 'Social Studies', subject: 'History', language: 'English', reading_level: 'Grade 6', grade_range: '5-8', publisher: 'East African Publishers', published_year: 2019, ai_summary: 'A thorough and engaging journey through Kenya\'s rich history for young learners.', ai_tags: ['Kenya History', 'Independence', 'Culture'], created_at: '2024-01-15' },
  { id: 'b040', title: 'Communities of Kenya', author: 'Elizabeth Wanjira', isbn: '978-9966-50-110-0', cover_url: null, description: 'Exploring the diverse communities and cultures of Kenya.', category: 'Social Studies', subject: 'Cultural Studies', language: 'English', reading_level: 'Grade 4', grade_range: '3-5', publisher: 'KICD', published_year: 2020, ai_summary: 'A celebration of Kenya\'s 44+ communities, their traditions, and cultural practices.', ai_tags: ['Communities', 'Culture', 'Diversity'], created_at: '2024-02-15' },
  { id: 'b041', title: 'Map Reading Made Simple', author: 'George Kiprotich', isbn: '978-9966-50-120-9', cover_url: null, description: 'Learn to read maps, understand scale, and navigate geography.', category: 'Social Studies', subject: 'Geography', language: 'English', reading_level: 'Grade 5', grade_range: '4-7', publisher: 'Longhorn', published_year: 2021, ai_summary: 'A practical guide to map reading and geographical skills for primary students.', ai_tags: ['Geography', 'Maps', 'Navigation'], created_at: '2024-03-15' },
  { id: 'b042', title: 'Our Government', author: 'Martha Karua Jr.', isbn: '978-9966-50-130-8', cover_url: null, description: 'Understanding how the Kenyan government works.', category: 'Social Studies', subject: 'Civics', language: 'English', reading_level: 'Grade 6', grade_range: '5-8', publisher: 'Oxford University Press', published_year: 2022, ai_summary: 'An accessible guide to Kenya\'s constitution, government structure, and civic responsibility.', ai_tags: ['Government', 'Civics', 'Constitution'], created_at: '2024-04-15' },
  { id: 'b043', title: 'African Heroes and Heroines', author: 'Amina Mohamed', isbn: '978-9966-50-140-7', cover_url: null, description: 'Biographies of notable African leaders and change-makers.', category: 'Social Studies', subject: 'Biography', language: 'English', reading_level: 'Grade 5', grade_range: '4-7', publisher: 'East African Publishers', published_year: 2021, ai_summary: 'Inspiring stories of African leaders who made lasting impacts on their communities.', ai_tags: ['Biography', 'Leadership', 'Africa'], created_at: '2024-05-15' },
  { id: 'b044', title: 'Environmental Conservation', author: 'Wangari Mathai Foundation', isbn: '978-9966-50-150-6', cover_url: null, description: 'Learning about environmental stewardship inspired by Wangari Maathai.', category: 'Social Studies', subject: 'Environmental Studies', language: 'English', reading_level: 'Grade 4', grade_range: '3-6', publisher: 'KICD', published_year: 2023, ai_summary: 'A tribute to Wangari Maathai\'s legacy, teaching environmental conservation to young Kenyans.', ai_tags: ['Environment', 'Wangari Maathai', 'Conservation'], created_at: '2024-06-15' },

  // Reference (6)
  { id: 'b045', title: 'Oxford Primary Dictionary', author: 'Oxford University Press', isbn: '978-0-19-276745-3', cover_url: null, description: 'A comprehensive dictionary for primary school students.', category: 'Reference', subject: 'Language', language: 'English', reading_level: 'Grade 3', grade_range: '1-8', publisher: 'Oxford University Press', published_year: 2018, ai_summary: 'A reliable, comprehensive dictionary designed specifically for primary school learners.', ai_tags: ['Dictionary', 'Reference', 'Language'], created_at: '2024-01-15' },
  { id: 'b046', title: 'Kenya Atlas for Schools', author: 'Survey of Kenya', isbn: '978-9966-00-340-1', cover_url: null, description: 'Official school atlas with maps of Kenya and East Africa.', category: 'Reference', subject: 'Geography', language: 'English', reading_level: 'Grade 4', grade_range: '3-8', publisher: 'Survey of Kenya', published_year: 2020, ai_summary: 'The official school atlas featuring detailed maps of Kenya, East Africa, and the world.', ai_tags: ['Atlas', 'Maps', 'Geography'], created_at: '2024-02-01' },
  { id: 'b047', title: 'Encyclopaedia of East Africa', author: 'Various', isbn: '978-9966-00-350-0', cover_url: null, description: 'A young reader\'s encyclopedia focused on East Africa.', category: 'Reference', subject: 'General Knowledge', language: 'English', reading_level: 'Grade 5', grade_range: '4-8', publisher: 'East African Publishers', published_year: 2019, ai_summary: 'A comprehensive encyclopedia covering East African history, geography, culture, and nature.', ai_tags: ['Encyclopedia', 'East Africa', 'Reference'], created_at: '2024-03-01' },
  { id: 'b048', title: 'English-Swahili Phrasebook', author: 'Dr. Kamal Khan', isbn: '978-9966-00-360-9', cover_url: null, description: 'Essential English-Swahili phrases for everyday communication.', category: 'Reference', subject: 'Language', language: 'English', reading_level: 'Grade 2', grade_range: '1-8', publisher: 'Longhorn', published_year: 2021, ai_summary: 'A practical bilingual phrasebook for students developing their English and Swahili skills.', ai_tags: ['Phrasebook', 'Bilingual', 'Language'], created_at: '2024-04-01' },
  { id: 'b049', title: 'Science Reference Guide', author: 'KICD', isbn: '978-9966-00-370-8', cover_url: null, description: 'Quick reference guide for primary school science concepts.', category: 'Reference', subject: 'Science', language: 'English', reading_level: 'Grade 5', grade_range: '4-8', publisher: 'KICD', published_year: 2022, ai_summary: 'A handy reference guide covering key science concepts for primary school examinations.', ai_tags: ['Science', 'Reference', 'Exam Prep'], created_at: '2024-05-01' },
  { id: 'b050', title: 'Creative Writing Handbook', author: 'Prof. Ngugi Mwangi', isbn: '978-9966-00-380-7', cover_url: null, description: 'A guide to creative writing for young authors.', category: 'Reference', subject: 'English Language', language: 'English', reading_level: 'Grade 5', grade_range: '4-8', publisher: 'Oxford University Press', published_year: 2023, ai_summary: 'An inspiring guide to help young Kenyan students discover their writing voice.', ai_tags: ['Writing', 'Creative', 'Guide'], created_at: '2024-06-01' },
];

// ---- Demo Profiles ----
export const DEMO_PROFILES: Profile[] = [
  // Super Admin
  { id: 'u001', full_name: 'Dr. Mary Kamau', role: 'super_admin', center_id: null, grade_level: null, reading_level: null, avatar_url: null, created_at: '2024-01-15' },

  // Center Librarians
  { id: 'u002', full_name: 'Grace Wanjiku', role: 'center_librarian', center_id: 'c001', grade_level: null, reading_level: null, avatar_url: null, created_at: '2024-01-15' },
  { id: 'u003', full_name: 'Samuel Ochieng', role: 'center_librarian', center_id: 'c002', grade_level: null, reading_level: null, avatar_url: null, created_at: '2024-01-15' },

  // Teachers
  { id: 'u004', full_name: 'Alice Muthoni', role: 'teacher', center_id: 'c001', grade_level: 4, reading_level: null, avatar_url: null, created_at: '2024-02-01' },
  { id: 'u005', full_name: 'James Kipchoge', role: 'teacher', center_id: 'c001', grade_level: 6, reading_level: null, avatar_url: null, created_at: '2024-02-01' },
  { id: 'u006', full_name: 'Faith Akinyi', role: 'teacher', center_id: 'c002', grade_level: 5, reading_level: null, avatar_url: null, created_at: '2024-02-15' },

  // Students
  { id: 'u007', full_name: 'Brian Otieno', role: 'student', center_id: 'c001', grade_level: 4, reading_level: 'Grade 4', avatar_url: null, created_at: '2024-03-01' },
  { id: 'u008', full_name: 'Mercy Wambui', role: 'student', center_id: 'c001', grade_level: 6, reading_level: 'Grade 6', avatar_url: null, created_at: '2024-03-01' },
  { id: 'u009', full_name: 'Kevin Njoroge', role: 'student', center_id: 'c001', grade_level: 3, reading_level: 'Grade 3', avatar_url: null, created_at: '2024-03-15' },
  { id: 'u010', full_name: 'Sharon Adhiambo', role: 'student', center_id: 'c002', grade_level: 5, reading_level: 'Grade 5', avatar_url: null, created_at: '2024-04-01' },
  { id: 'u011', full_name: 'Daniel Mwangi', role: 'student', center_id: 'c002', grade_level: 7, reading_level: 'Grade 7', avatar_url: null, created_at: '2024-04-01' },
];

// ---- Demo Book Copies (distributed across centers) ----
export const DEMO_COPIES: BookCopy[] = [
  // Mathare center copies
  { id: 'cp001', book_id: 'b001', center_id: 'c001', copy_number: 1, condition: 'good', status: 'available', barcode: 'MOHI-MTH-001-1', acquired_date: '2024-01-20', created_at: '2024-01-20' },
  { id: 'cp002', book_id: 'b001', center_id: 'c001', copy_number: 2, condition: 'fair', status: 'borrowed', barcode: 'MOHI-MTH-001-2', acquired_date: '2024-01-20', created_at: '2024-01-20' },
  { id: 'cp003', book_id: 'b003', center_id: 'c001', copy_number: 1, condition: 'new', status: 'available', barcode: 'MOHI-MTH-003-1', acquired_date: '2024-02-01', created_at: '2024-02-01' },
  { id: 'cp004', book_id: 'b004', center_id: 'c001', copy_number: 1, condition: 'good', status: 'borrowed', barcode: 'MOHI-MTH-004-1', acquired_date: '2024-02-01', created_at: '2024-02-01' },
  { id: 'cp005', book_id: 'b007', center_id: 'c001', copy_number: 1, condition: 'good', status: 'available', barcode: 'MOHI-MTH-007-1', acquired_date: '2024-02-15', created_at: '2024-02-15' },
  { id: 'cp006', book_id: 'b007', center_id: 'c001', copy_number: 2, condition: 'worn', status: 'borrowed', barcode: 'MOHI-MTH-007-2', acquired_date: '2024-02-15', created_at: '2024-02-15' },
  { id: 'cp007', book_id: 'b011', center_id: 'c001', copy_number: 1, condition: 'good', status: 'available', barcode: 'MOHI-MTH-011-1', acquired_date: '2024-03-01', created_at: '2024-03-01' },
  { id: 'cp008', book_id: 'b019', center_id: 'c001', copy_number: 1, condition: 'new', status: 'available', barcode: 'MOHI-MTH-019-1', acquired_date: '2024-03-01', created_at: '2024-03-01' },
  { id: 'cp009', book_id: 'b027', center_id: 'c001', copy_number: 1, condition: 'good', status: 'borrowed', barcode: 'MOHI-MTH-027-1', acquired_date: '2024-03-15', created_at: '2024-03-15' },
  { id: 'cp010', book_id: 'b033', center_id: 'c001', copy_number: 1, condition: 'good', status: 'available', barcode: 'MOHI-MTH-033-1', acquired_date: '2024-04-01', created_at: '2024-04-01' },
  { id: 'cp011', book_id: 'b039', center_id: 'c001', copy_number: 1, condition: 'fair', status: 'available', barcode: 'MOHI-MTH-039-1', acquired_date: '2024-04-01', created_at: '2024-04-01' },
  { id: 'cp012', book_id: 'b045', center_id: 'c001', copy_number: 1, condition: 'good', status: 'available', barcode: 'MOHI-MTH-045-1', acquired_date: '2024-04-15', created_at: '2024-04-15' },

  // Kibera center copies
  { id: 'cp013', book_id: 'b001', center_id: 'c002', copy_number: 1, condition: 'good', status: 'available', barcode: 'MOHI-KBR-001-1', acquired_date: '2024-01-20', created_at: '2024-01-20' },
  { id: 'cp014', book_id: 'b002', center_id: 'c002', copy_number: 1, condition: 'good', status: 'borrowed', barcode: 'MOHI-KBR-002-1', acquired_date: '2024-01-20', created_at: '2024-01-20' },
  { id: 'cp015', book_id: 'b005', center_id: 'c002', copy_number: 1, condition: 'new', status: 'available', barcode: 'MOHI-KBR-005-1', acquired_date: '2024-02-01', created_at: '2024-02-01' },
  { id: 'cp016', book_id: 'b006', center_id: 'c002', copy_number: 1, condition: 'good', status: 'available', barcode: 'MOHI-KBR-006-1', acquired_date: '2024-02-01', created_at: '2024-02-01' },
  { id: 'cp017', book_id: 'b012', center_id: 'c002', copy_number: 1, condition: 'good', status: 'borrowed', barcode: 'MOHI-KBR-012-1', acquired_date: '2024-02-15', created_at: '2024-02-15' },
  { id: 'cp018', book_id: 'b020', center_id: 'c002', copy_number: 1, condition: 'good', status: 'available', barcode: 'MOHI-KBR-020-1', acquired_date: '2024-03-01', created_at: '2024-03-01' },
  { id: 'cp019', book_id: 'b028', center_id: 'c002', copy_number: 1, condition: 'fair', status: 'available', barcode: 'MOHI-KBR-028-1', acquired_date: '2024-03-15', created_at: '2024-03-15' },
  { id: 'cp020', book_id: 'b034', center_id: 'c002', copy_number: 1, condition: 'good', status: 'available', barcode: 'MOHI-KBR-034-1', acquired_date: '2024-04-01', created_at: '2024-04-01' },
];

// ---- Demo Loans ----
export const DEMO_LOANS: Loan[] = [
  { id: 'l001', copy_id: 'cp002', book_id: 'b001', member_id: 'u008', center_id: 'c001', borrowed_date: '2026-05-20', due_date: '2026-06-03', returned_date: null, status: 'overdue', renewal_count: 0, overdue_risk_score: 0.85, created_at: '2026-05-20' },
  { id: 'l002', copy_id: 'cp004', book_id: 'b004', member_id: 'u007', center_id: 'c001', borrowed_date: '2026-06-01', due_date: '2026-06-15', returned_date: null, status: 'active', renewal_count: 0, overdue_risk_score: 0.25, created_at: '2026-06-01' },
  { id: 'l003', copy_id: 'cp006', book_id: 'b007', member_id: 'u009', center_id: 'c001', borrowed_date: '2026-06-05', due_date: '2026-06-19', returned_date: null, status: 'active', renewal_count: 1, overdue_risk_score: 0.15, created_at: '2026-06-05' },
  { id: 'l004', copy_id: 'cp009', book_id: 'b027', member_id: 'u004', center_id: 'c001', borrowed_date: '2026-05-28', due_date: '2026-06-11', returned_date: null, status: 'active', renewal_count: 0, overdue_risk_score: 0.55, created_at: '2026-05-28' },
  { id: 'l005', copy_id: 'cp014', book_id: 'b002', member_id: 'u011', center_id: 'c002', borrowed_date: '2026-06-02', due_date: '2026-06-16', returned_date: null, status: 'active', renewal_count: 0, overdue_risk_score: 0.30, created_at: '2026-06-02' },
  { id: 'l006', copy_id: 'cp017', book_id: 'b012', member_id: 'u010', center_id: 'c002', borrowed_date: '2026-05-15', due_date: '2026-05-29', returned_date: null, status: 'overdue', renewal_count: 1, overdue_risk_score: 0.92, created_at: '2026-05-15' },
  // Returned loans
  { id: 'l007', copy_id: 'cp003', book_id: 'b003', member_id: 'u007', center_id: 'c001', borrowed_date: '2026-04-01', due_date: '2026-04-15', returned_date: '2026-04-12', status: 'returned', renewal_count: 0, overdue_risk_score: null, created_at: '2026-04-01' },
  { id: 'l008', copy_id: 'cp005', book_id: 'b007', member_id: 'u008', center_id: 'c001', borrowed_date: '2026-04-10', due_date: '2026-04-24', returned_date: '2026-04-22', status: 'returned', renewal_count: 0, overdue_risk_score: null, created_at: '2026-04-10' },
  { id: 'l009', copy_id: 'cp007', book_id: 'b011', member_id: 'u009', center_id: 'c001', borrowed_date: '2026-05-01', due_date: '2026-05-15', returned_date: '2026-05-14', status: 'returned', renewal_count: 0, overdue_risk_score: null, created_at: '2026-05-01' },
];

// ---- Demo Reservations ----
export const DEMO_RESERVATIONS: Reservation[] = [
  { id: 'r001', book_id: 'b001', center_id: 'c001', member_id: 'u009', reserved_date: '2026-06-08', status: 'pending' },
  { id: 'r002', book_id: 'b007', center_id: 'c001', member_id: 'u008', reserved_date: '2026-06-07', status: 'pending' },
  { id: 'r003', book_id: 'b002', center_id: 'c002', member_id: 'u010', reserved_date: '2026-06-06', status: 'pending' },
];

// ---- Demo Reading Logs ----
export const DEMO_READING_LOGS: ReadingLog[] = [
  { id: 'rl001', member_id: 'u007', book_id: 'b003', started_date: '2026-04-01', finished_date: '2026-04-12', rating: 5, notes: 'I loved Charlotte! She was so smart and kind.', pages_read: 184 },
  { id: 'rl002', member_id: 'u008', book_id: 'b007', started_date: '2026-04-10', finished_date: '2026-04-22', rating: 5, notes: 'Harry Potter is amazing! I want to read the next one.', pages_read: 309 },
  { id: 'rl003', member_id: 'u009', book_id: 'b011', started_date: '2026-05-01', finished_date: '2026-05-14', rating: 4, notes: 'Siku Njema ilikuwa hadithi nzuri sana.', pages_read: 256 },
  { id: 'rl004', member_id: 'u007', book_id: 'b019', started_date: '2026-05-15', finished_date: '2026-05-28', rating: 4, notes: 'I learned a lot about our bodies!', pages_read: 120 },
  { id: 'rl005', member_id: 'u008', book_id: 'b001', started_date: '2026-05-20', finished_date: null, rating: null, notes: 'Still reading, very interesting story.', pages_read: 89 },
];

// ---- Demo AI Recommendations ----
export const DEMO_RECOMMENDATIONS: AIRecommendation[] = [
  { id: 'ai001', member_id: 'u007', book_id: 'b004', reason: 'Based on your love for Charlotte\'s Web, Matilda is another wonderful story about a young person with extraordinary abilities. Both books celebrate kindness and imagination!', score: 0.95, generated_at: '2026-06-08', shown: true },
  { id: 'ai002', member_id: 'u007', book_id: 'b009', reason: 'Since you enjoyed stories about nature and animals, The Secret Garden will take you on a magical journey of discovery through a hidden garden.', score: 0.88, generated_at: '2026-06-08', shown: false },
  { id: 'ai003', member_id: 'u007', book_id: 'b022', reason: 'You showed interest in science topics. The Solar System for Kids matches your Grade 4 reading level and will take you on an adventure through space!', score: 0.82, generated_at: '2026-06-08', shown: false },
  { id: 'ai004', member_id: 'u008', book_id: 'b002', reason: 'Since you\'re reading Things Fall Apart, The River Between by the same publisher explores similar themes of cultural identity, set right here in Kenya.', score: 0.92, generated_at: '2026-06-08', shown: true },
  { id: 'ai005', member_id: 'u008', book_id: 'b010', reason: 'Roll of Thunder, Hear My Cry shares themes of family strength and social justice that connect well with your reading of African literature.', score: 0.85, generated_at: '2026-06-08', shown: false },
];

// ---- Loans per week (last 12 weeks) for charts ----
export const DEMO_LOANS_PER_WEEK: Array<{ week: string; loans: number; returns: number }> = [
  { week: 'W13', loans: 45, returns: 38 },
  { week: 'W14', loans: 52, returns: 41 },
  { week: 'W15', loans: 48, returns: 45 },
  { week: 'W16', loans: 61, returns: 50 },
  { week: 'W17', loans: 55, returns: 52 },
  { week: 'W18', loans: 67, returns: 58 },
  { week: 'W19', loans: 59, returns: 55 },
  { week: 'W20', loans: 73, returns: 62 },
  { week: 'W21', loans: 68, returns: 65 },
  { week: 'W22', loans: 71, returns: 60 },
  { week: 'W23', loans: 78, returns: 70 },
  { week: 'W24', loans: 82, returns: 74 },
];

// ---- Top borrowed books ----
export const DEMO_TOP_BORROWED = [
  { book: DEMO_BOOKS[6], totalLoans: 156 },   // Harry Potter
  { book: DEMO_BOOKS[2], totalLoans: 134 },   // Charlotte's Web
  { book: DEMO_BOOKS[0], totalLoans: 128 },   // Things Fall Apart
  { book: DEMO_BOOKS[10], totalLoans: 121 },  // Siku Njema
  { book: DEMO_BOOKS[3], totalLoans: 112 },   // Matilda
];

// ---- Helper: get book by id ----
export function getBookById(id: string): Book | undefined {
  return DEMO_BOOKS.find(b => b.id === id);
}

// ---- Helper: get profile by id ----
export function getProfileById(id: string): Profile | undefined {
  return DEMO_PROFILES.find(p => p.id === id);
}

// ---- Helper: get center by id ----
export function getCenterById(id: string): Center | undefined {
  return DEMO_CENTERS.find(c => c.id === id);
}

// ---- Helper: enrich loans with joined data ----
export function enrichLoans(loans: Loan[]): Loan[] {
  return loans.map(loan => ({
    ...loan,
    book: getBookById(loan.book_id),
    member: getProfileById(loan.member_id),
  }));
}

// ---- Helper: enrich copies with joined data ----
export function enrichCopies(copies: BookCopy[]): BookCopy[] {
  return copies.map(copy => ({
    ...copy,
    book: getBookById(copy.book_id),
    center: getCenterById(copy.center_id),
  }));
}

// ---- Helper: enrich recommendations ----
export function enrichRecommendations(recs: AIRecommendation[]): AIRecommendation[] {
  return recs.map(rec => ({
    ...rec,
    book: getBookById(rec.book_id),
  }));
}
