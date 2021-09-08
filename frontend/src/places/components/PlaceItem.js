import React, { useEffect, useState, useContext } from 'react';
import { Carousel } from 'react-responsive-carousel';

import { AuthContext } from '../../shared/context/auth-context';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { useHttp } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './PlaceItem.css';

const PlaceItem = (props) => {
  const authCtx = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, error, sendRequest, clearError] = useHttp();
  const [isLikeLoading, likeError, sendLikeRequest, clearLikeError] = useHttp();

  const isLikedByUser = props.likes.find(
    (like) => like.creator === authCtx.userId
  );
  useEffect(() => {
    setIsLiked(!!isLikedByUser);
  }, [isLikedByUser]);

  const openMapHandler = () => {
    setShowMap(true);
  };
  const closeMapHandler = () => {
    setShowMap(false);
  };

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + authCtx.token
        }
      );
      props.onDelete(props.id);
    } catch (error) {}
  };

  const unlikeHandler = async () => {
    try {
      await sendLikeRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}/like`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + authCtx.token
        }
      );
      setIsLiked(false);
    } catch (error) {}
  };

  const likeHandler = async () => {
    try {
      await sendLikeRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}/like`,
        'POST',
        null,
        {
          Authorization: 'Bearer ' + authCtx.token
        }
      );
      setIsLiked(true);
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <ErrorModal error={likeError} onClear={clearLikeError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-action"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and delete this place?</p>
      </Modal>
      <li className="place-item">
        {isLoading && <LoadingSpinner asOverlay />}
        <Card className="place-item__content">
          <div className="place-item__image">
            <Carousel
              showThumbs={false}
              infiniteLoop={true}
              dynamicHeight={false}
            >
              {props.images.map((i, index) => (
                <div key={`image-${index}`}>
                  <img
                    src={`${process.env.REACT_APP_ASSETS_URL}/${i}`}
                    alt={props.title}
                  />
                </div>
              ))}
            </Carousel>
            {/* <img
              src={`${process.env.REACT_APP_ASSETS_URL}/${props.images[0]}`}
              alt={props.title}
            /> */}
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
            {authCtx.userId === props.creator ? (
              <div className="place-item__like">
                {props.likes.length}
                {props.likes.length === 1 ? ' Like' : ' Likes'}
              </div>
            ) : (
              <Button
                size="small"
                like
                onClick={isLiked ? unlikeHandler : likeHandler}
              >
                {isLikeLoading && <LoadingSpinner small />}
                {!isLikeLoading && isLiked && 'Un-Like'}
                {!isLikeLoading && !isLiked && 'Like!'}
              </Button>
            )}
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {authCtx.userId === props.creator && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {authCtx.userId === props.creator && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
