import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import './UserItem.css';

const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.user.id}/places`}>
          <div className="user-item__image">
            <Avatar image={props.user.image} alt={props.user.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.user.name}</h2>
            <h3>
              {props.user.places} {props.user.places === 1 ? 'Place' : 'Places'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
