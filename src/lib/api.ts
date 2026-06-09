import { supabase } from './supabase';

export async function getCenterCatalog(centerId: string) {
  const { data, error } = await supabase
    .from('book_copies')
    .select('*, book:books(*)')
    .eq('center_id', centerId);
  
  if (error) {
    console.error('Error fetching catalog:', error);
    return [];
  }
  return data;
}

export async function getCenterLoans(centerId: string) {
  const { data, error } = await supabase
    .from('loans')
    .select('*, book:book_copies(book:books(*)), member:profiles(*)')
    .eq('center_id', centerId);
    
  if (error) {
    console.error('Error fetching loans:', error);
    return [];
  }
  
  // Flatten the nested book object for easier access
  return data.map((loan: any) => ({
    ...loan,
    book: loan.book?.book
  }));
}

export async function getCenterMembers(centerId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('center_id', centerId);
    
  if (error) {
    console.error('Error fetching members:', error);
    return [];
  }
  return data;
}

export async function getMemberProfile(memberId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', memberId)
    .single();
    
  if (error) {
    console.error('Error fetching member profile:', error);
    return null;
  }
  return data;
}

export async function getMemberLoans(memberId: string) {
  const { data, error } = await supabase
    .from('loans')
    .select('*, book:book_copies(book:books(*))')
    .eq('member_id', memberId);
    
  if (error) {
    console.error('Error fetching member loans:', error);
    return [];
  }
  
  return data.map((loan: any) => ({
    ...loan,
    book: loan.book?.book
  }));
}

export async function getMemberReadingLogs(memberId: string) {
  const { data, error } = await supabase
    .from('reading_logs')
    .select('*, book:books(*)')
    .eq('member_id', memberId)
    .order('started_date', { ascending: false });
    
  if (error) {
    console.error('Error fetching reading logs:', error);
    return [];
  }
  return data;
}

export async function getCenterAvailableBooks(centerId: string) {
  const { data, error } = await supabase
    .from('book_copies')
    .select('*, book:books(*)')
    .eq('center_id', centerId)
    .eq('status', 'available');
    
  if (error) {
    console.error('Error fetching available books:', error);
    return [];
  }
  
  // Return unique books (remove duplicate copies)
  const uniqueBooks = new Map();
  for (const copy of data) {
    if (copy.book && !uniqueBooks.has(copy.book.id)) {
      uniqueBooks.set(copy.book.id, copy.book);
    }
  }
  
  return Array.from(uniqueBooks.values());
}

export async function getMemberRecommendations(memberId: string) {
  const { data, error } = await supabase
    .from('ai_recommendations')
    .select('*, book:books(*)')
    .eq('member_id', memberId);
    
  if (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
  return data;
}

export async function getStudentsReadingLogs(studentIds: string[]) {
  if (!studentIds || studentIds.length === 0) return [];
  
  const { data, error } = await supabase
    .from('reading_logs')
    .select('*, book:books(*)')
    .in('member_id', studentIds);
    
  if (error) {
    console.error('Error fetching student reading logs:', error);
    return [];
  }
  return data;
}

export async function onboardMember(data: any) {
  const { data: result, error } = await supabase.rpc('onboard_member', {
    p_email: data.email,
    p_password: data.password,
    p_full_name: data.full_name,
    p_role: data.role,
    p_center_id: data.center_id,
    p_grade_level: data.grade_level || null,
    p_reading_level: data.reading_level || null
  });

  if (error) {
    console.error('Error onboarding member:', error);
    throw error;
  }
  return result;
}

export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/avatar.${fileExt}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error('Error uploading avatar:', uploadError);
    throw uploadError;
  }

  // Get Public URL
  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  const avatarUrl = publicUrlData.publicUrl;

  // Update profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating profile with avatar:', updateError);
    throw updateError;
  }

  return avatarUrl;
}

export async function addBookCopy(bookData: any, centerId: string) {
  // First, check if book exists by ISBN or title
  let bookId;
  const { data: existingBooks } = await supabase
    .from('books')
    .select('id')
    .eq('isbn', bookData.isbn)
    .limit(1);

  if (existingBooks && existingBooks.length > 0) {
    bookId = existingBooks[0].id;
  } else {
    // Insert new book
    const { data: newBook, error: bookError } = await supabase
      .from('books')
      .insert({
        title: bookData.title,
        author: bookData.author,
        isbn: bookData.isbn,
        category: bookData.category,
        reading_level: bookData.reading_level,
        cover_url: bookData.cover_url,
        description: bookData.description
      })
      .select()
      .single();

    if (bookError) throw bookError;
    bookId = newBook.id;
  }

  // Add the copy
  const { data: copy, error: copyError } = await supabase
    .from('book_copies')
    .insert({
      book_id: bookId,
      center_id: centerId,
      condition: bookData.condition,
      status: 'available'
    })
    .select()
    .single();

  if (copyError) throw copyError;
  return copy;
}
