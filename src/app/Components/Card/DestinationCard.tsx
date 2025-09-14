import Link from "next/link";
import Image from "next/image";
import React from "react";

const DestinationCard = ({
  img,
  title,
  content,
}: {
  img: string;
  title: string;
  content: string;
}) => {
  return (
    <div className="new-top-desti-thumb">
      <Image src={img} alt="img" width={300} height={200} />
      <Link href="/destination/destination-details" className="icon img-popup2">
        <i className="bi bi-plus-lg"></i>
      </Link>
      <div className="content">
        <h4>
          <Link href="/destination/destination-details">{title}</Link>
        </h4>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default DestinationCard;
