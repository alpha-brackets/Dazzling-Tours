import Image from "next/image";
import Link from "next/link";
import React from "react";

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
              <i className="bi bi-send"></i>
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
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <h6>{review}</h6>
          </div>
          <Link href="/tour/tour-details" className="theme-btn">
            Book Now<i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
