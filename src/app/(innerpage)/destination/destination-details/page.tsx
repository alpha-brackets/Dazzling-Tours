import React from 'react';
import BreadCumb from '../../../Components/Common/BreadCumb';
import DestinationDetails from '../../../Components/DestinationDetails/DestinationDetails';

const page = () => {
  return (
    <div>
             <BreadCumb
                bgimg="/assets/img/breadcrumb/breadcrumb.jpg"
                Title="Destination Details"
            ></BreadCumb>    
            <DestinationDetails></DestinationDetails>       
    </div>
  );
};

export default page;