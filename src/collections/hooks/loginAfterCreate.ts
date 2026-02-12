import type { CollectionAfterChangeHook, User } from 'payload';

interface LoginBody {
  email?: string;
  password?: string;
}

interface DocWithAuth extends User {
  token?: string;
  user?: User;
}

export const loginAfterCreate: CollectionAfterChangeHook<User> = async ({
  doc,
  operation,
  req,
}) => {
  if (operation === 'create') {
    const { email, password } = req.body as LoginBody;

    if (email && password) {
      const { token, user } = await req.payload.login({
        collection: 'users',
        data: { email, password },
        req,
      });

      return {
        ...doc,
        token,
        user,
      } as DocWithAuth;
    }
  }

  return doc;
};
