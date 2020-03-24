/**
 * -------------- MOCK DATA ----------------
 */

const users = [
  {
    id: 1,
    name: {
      first: 'f',
      last: 'l',
    },
  },
];

const teams = [
  {
    id: 1,
    contact: {},
  },
];

const accounts = [
  {
    id: 1,
    contact: {},
    billing: {},
    units: [1, 2],
  },
];

const units = [
  {
    id: 1,
    address: {
      street: 'a',
    },
    notes: {},
  },
  {
    id: 2,
    address: {
      street: 'b',
    },
    notes: {},
  },
];

const roles = {
  admin: {
    id: 'admin',
    name: 'Admin',
    description: '',
    resource: [
      {
        id: 'blog',
        permissions: ['create', 'read', 'update', 'delete'],
      },
      {
        id: 'user',
        permissions: ['create', 'read', 'update', 'delete'],
      },
      {
        id: 'journal',
        permissions: ['create', 'read', 'update', 'delete'],
      },
    ],
  },
  editor: {
    id: 'editor',
    name: 'Editor',
    description: '',
    resource: [
      {
        id: 'blog',
        permissions: ['create', 'read', 'update', 'delete'],
      },
      {
        id: 'user',
        permissions: ['read'],
      },
      {
        id: 'journal',
        permissions: ['create', 'read', 'update'],
      },
    ],
  },
};

module.exports = {
  roles,
  users,
  teams,
  accounts,
  units,
};
