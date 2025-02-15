'use client'
import { login } from './actions'
import { LoginButton } from '../../components/LoginButton'
import Link from 'next/link'
import { toast, Toaster } from 'react-hot-toast'

export default function LoginPage() {
  const handleSubmit = async (formData: FormData) => {
    const result = await login(formData)
    if (result?.error) {
      toast.error(result.error)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster />
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome Home Cooks</h2>
          <p className="mt-2 text-sm text-gray-600">Please sign in to Overcook</p>
          <p className="mt-2 text-sm text-gray-600">If you have just signed up, please confirm your email first.</p>
        </div>
        <form className="mt-8 space-y-6" action={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-4 w-full">
            <button
              type="submit"
              className="w-full bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log in
            </button>
            <LoginButton />
          </div>
          <p className='text-sm text-indigo-800'>Don't have an account? <Link href="/signup" className='text-indigo-800 underline hover:text-indigo-600 hover:underline underline-offset-2'>Sign up now!</Link></p>
        </form>
      </div>
    </div>
  )
}
