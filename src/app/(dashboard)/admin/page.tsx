import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import React from 'react'

const page = async () => {
  const session = await getServerSession(authOptions);
 if(session?.user){
  return  <div>{"Welcome, "+session?.user.username+"!"}</div>
 }
  return (
    <div>
      Please Login!
    </div>
  )
}

export default page