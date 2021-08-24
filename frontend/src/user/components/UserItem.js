import React from 'react';
import './UserItem.css';

const UserItem = (props) => {
  return (
    <li className="user-item">
      <div className="user-item__content">
        <div className="user-item__image">
          <img src={props.user.image} alt={props.user.name} />
        </div>
        <div className="user-item__info">
          <h2>{props.user.name}</h2>
          <h3>
            {props.user.places} {props.user.places === 1 ? 'Place' : 'Places'}
          </h3>
        </div>
      </div>
    </li>
  );
};

export default UserItem;
