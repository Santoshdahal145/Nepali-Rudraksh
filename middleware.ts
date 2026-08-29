import { NextRequest } from 'next/server'
import { parseAccessTokenFromCookie, verifyJwt } from './lib/jwt'

export const config = {
  matcher: '/api/:function*',
}
 
export  function middleware(request: NextRequest) {
    const token=parseAccessTokenFromCookie(request)
    const payload= token && verifyJwt(token)
    if (!payload) {
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}