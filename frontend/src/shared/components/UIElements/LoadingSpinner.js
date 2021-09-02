import React from 'react';

import './LoadingSpinner.css';

const LoadingSpinner = (props) => {
  return (
    <div className={`${props.asOverlay && 'loading-spinner__overlay'}`}>
      <div className={`lds-dual-ring${props.small && '__small'}`}></div>
    </div>
  );
};

export default LoadingSpinner;
