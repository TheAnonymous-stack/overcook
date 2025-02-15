'use client'
import { createClient } from '@/utils/supabase/client'

export function LoginButton() {
  const handleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
      },
    })
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
      }
    }
        
  }

  return <button className='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' onClick={handleLogin}>Sign in with Google</button>
}