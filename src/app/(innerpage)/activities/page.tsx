import React from 'react';
import BreadCumb from '../../Components/Common/BreadCumb';
import Activities from '../../Components/Activities/Activities';

const page = () => {
  return (
    <div>
              <BreadCumb
                bgimg="/assets/img/breadcrumb/breadcrumb.jpg"
                Title="Activities"
            ></BreadCumb>    
            <Activities></Activities>        
    </div>
  );
};

export default page;