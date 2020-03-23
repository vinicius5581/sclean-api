/**
 * -------------- MOCK DATA ----------------
 */

const users = [
    {
        id: 1,
        name: {
            first: 'f',
            last: 'l'
        },
    }
];

const teams = [
    {
        id: 1,
        contact: {},
    }
];

const accounts = [
    {
        id: 1,
        contact: {},
        billing: {},
        units: [1, 2]
    }
];

const units = [
    {
        id: 1,
        address: {
            street: 'a'
        },
        notes: {},
    },
    {
        id: 2,
        address: {
            street: 'b'
        },
        notes: {},
    }
];

module.exports = {
    users,
    teams,
    accounts,
    units,
}