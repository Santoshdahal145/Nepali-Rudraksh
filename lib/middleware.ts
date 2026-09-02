import { getCurrentUser } from "./auth.utils";

import { UnauthorizedError, ForbiddenError } from "./error";



export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  if (user.role !== "ADMIN") {
    throw new ForbiddenError();
  }

  return user;
}