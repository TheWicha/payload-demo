import type { CollectionConfig, FieldAccess } from 'payload';
import { admins } from './access/admins';
import { adminsAndUser } from './access/adminsAndUser';
import { anyone } from './access/anyone';
import { checkRole } from './access/checkRole';
import { loginAfterCreate } from './hooks/loginAfterCreate';
import { protectRoles } from './hooks/protectRoles';
import { User } from '@/payload-types';

const fieldAdminsAndUser: FieldAccess = ({ req: { user }, id }) => {
  if (user) {
    if (checkRole(['admin'], user)) {
      return true;
    }
    return user.id === id;
  }
  return false;
};

const fieldAdmins: FieldAccess = ({ req: { user } }) => checkRole(['admin'], user);
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 28800, // 8 hours
    cookies: {
      sameSite: 'None',
      secure: true,
      domain: process.env.COOKIE_DOMAIN,
    },
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: adminsAndUser,
    create: anyone,
    update: adminsAndUser,
    delete: admins,
    unlock: admins,
    admin: ({ req: { user } }: { req: { user: User | null } }) => checkRole(['admin'], user),
  },
  hooks: {
    afterChange: [loginAfterCreate],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      access: {
        read: fieldAdminsAndUser,
        update: fieldAdminsAndUser,
      },
    },
    {
      name: 'resetPasswordToken',
      type: 'text',
      hidden: true,
    },
    {
      name: 'resetPasswordExpiration',
      type: 'date',
      hidden: true,
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      access: {
        read: fieldAdmins,
        update: fieldAdmins,
        create: fieldAdmins,
      },
      hooks: {
        beforeChange: [protectRoles],
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
    },
  ],
};
