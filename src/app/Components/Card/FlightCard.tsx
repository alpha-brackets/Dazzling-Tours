import Image from "next/image";
import Link from "next/link";
import React from "react";

import Icon from "@/app/Components/Common/Icon";

interface FlightCardProps {
  img: string;
  name: string;
  oneway: string;
  destination: string;
  price: string;
  review: string;
}

const FlightCard = ({
  img,
  name,
  oneway,
  destination,
  price,
  review,
}: FlightCardProps) => {
  return (
    <div className="featured-flight-items">
      <div className="featured-image">
        <Image src={img} alt="img" width={416} height={336} />
      </div>
      <div className="featured-content">
        <div className="featured-post">
          <ul className="feature-list">
            <li>
              <Icon name="send" />
              {name}
            </li>
          </ul>
          <div className="text">
            <p>{oneway}</p>
          </div>
        </div>
        <div className="featured-cont">
          <div className="content">
            <h4>
              <Link href="/tour/tour-details">{destination}</Link>
            </h4>
          </div>
          <p>
            From <b>{price}</b>
          </p>
        </div>
        <div className="featured-rating">
          <div className="star">
            <Icon name="star-fill" />
            <Icon name="star-fill" />
            <Icon name="star-fill" />
            <Icon name="star-fill" />
            <Icon name="star-fill" />
            <h6>{review}</h6>
          </div>
          <Link href="/tour/tour-details" className="relative overflow-hidden bg-primary text-white hover:text-white rounded-full font-bold uppercase transition-all duration-300 px-6 py-2">
            Book Now<Icon name="arrow-right" className="ml-2 inline-block" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
