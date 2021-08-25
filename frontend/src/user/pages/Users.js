import React from 'react';
import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      name: 'Eric',
      image: 'https://live.staticflickr.com/1697/24470537996_8d40753431_b.jpg',
      places: 1
    }
  ];
  return <UsersList items={USERS} />;
};

export default Users;
