'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return {
      error: error.message
    }
  } else {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('overcook_users')
        .select()
        .eq('id', user.id)
        .single()

      if (!existingUser) {
        // Only insert if user doesn't exist
        await supabase.from('overcook_users').insert([{ id: user.id }])
        redirect('/setup')
      } else {
        redirect('/dashboard')
      }
    }
    
  }


}