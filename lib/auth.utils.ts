
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type JwtPayloadType={
  userId: number,
  role: 'ADMIN'|'USER',
 iat: number,
 exp: number
}

export async function getCurrentUser():Promise<JwtPayloadType|null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) {
    return null;
  }

  try {
    const payload  =  jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    );
    return payload as JwtPayloadType;
  } catch(err) {
    return null;
  }
}