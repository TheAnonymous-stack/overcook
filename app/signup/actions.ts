'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email')
  const password = formData.get('password')
  const confirmPassword = formData.get('confirmPassword')

  if (!email || !password || !confirmPassword) {
    return {
        error: 'All fields are required'
    }
  }

  if (password !== confirmPassword) {
    return {
        error: 'Passwords do not match'
    }    
  }

  // type-casting here for convenience
  // in practice, you should validate your inputs

        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        }

        const { error } = await supabase.auth.signUp(data)

        if (error) {
            return {
                error: error.message
            }
        }

        revalidatePath('/', 'layout')
        redirect('/login')

}