import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Destination1 = () => {

    const destinationContent = [
        {img:'/assets/img/destination/01.jpg', location:'Indonesia', title:'Brooklyn Beach Resort Tour', rating:'4.7', day:'10 Days', number:'50+', price:'$59.00'},      
        {img:'/assets/img/destination/02.jpg', location:'Indonesia', title:'Pak Chumphon Town Tour ', rating:'4.7', day:'10 Days', number:'50+', price:'$59.00'},      
        {img:'/assets/img/destination/03.jpg', location:'Indonesia', title:'Java & Bali One Life Adventure', rating:'4.7', day:'10 Days', number:'50+', price:'$59.00'},      
        {img:'/assets/img/destination/04.jpg', location:'Indonesia', title:'Places To Travel In November', rating:'4.7', day:'10 Days', number:'50+', price:'$59.00'},      
        {img:'/assets/img/destination/05.jpg', location:'Indonesia', title:'Brooklyn Beach Resort Tour', rating:'4.7', day:'10 Days', number:'50+', price:'$59.00'},      
        {img:'/assets/img/destination/06.jpg', location:'Indonesia', title:'Pak Chumphon Town Tour ', rating:'4.7', day:'10 Days', number:'50+', price:'$59.00'},      
        {img:'/assets/img/destination/07.jpg', location:'Indonesia', title:'Java & Bali One Life Adventure', rating:'4.7', day:'10 Days', number:'50+', price:'$59.00'},      
        {img:'/assets/img/destination/08.jpg', location:'Indonesia', title:'Places To Travel In November', rating:'4.7', day:'10 Days', number:'50+', price:'$59.00'},       
      ]; 

    return (
        <section className="popular-destination-section section-padding pt-0">
            <div className="car-shape float-bob-x">
                <Image src="/assets/img/destination/car.png" alt="img" width={134} height={124}   />
            </div>
            <div className="container">
                <div className="section-title-area justify-content-between">
                    <div className="section-title">
                        <span className="sub-title wow fadeInUp">
                            Best Recommended Places
                        </span>
                        <h2 className="wow fadeInUp wow" data-wow-delay=".3s">
                            Popular Destination we offer for all
                        </h2>
                    </div>
                    <Link href="/tour/tour-details" className="theme-btn wow fadeInUp wow" data-wow-delay=".5s">View All Tour<i className="bi bi-arrow-right"></i></Link>
                </div> 
                <div className="row">
                {destinationContent.map((item, i) => (
                    <div key={i} className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp wow" data-wow-delay=".2s">
                        <div className="destination-card-items">
                            <div className="destination-image">
                                <Image src={item.img} alt="img" width={304} height={254}   />
                                <div className="heart-icon">
                                <i className="bi bi-heart"></i>
                                </div>
                            </div>
                            <div className="destination-content">
                                <ul className="meta">
                                    <li>
                                    <i className="bi bi-geo-alt"></i>
                                        {item.location}
                                    </li>
                                    <li className="rating">
                                        <div className="star">
                                        <i className="bi bi-star-fill"></i>
                                        </div>
                                        <p>{item.rating}</p>
                                    </li>
                                </ul>
                                <h5>
                                    <Link href="/tour/tour-details">
                                    {item.title}
                                    </Link>
                                </h5>
                                <ul className="info">
                                    <li>
                                    <i className="bi bi-clock"></i>
                                        {item.day}
                                    </li>
                                    <li>
                                    <i className="bi bi-person"></i>
                                        {item.number}
                                    </li>
                                </ul>
                                <div className="price">
                                    <h6>{item.price}<span>/Per day</span></h6>
                                    <Link href="/tour/tour-details" className="theme-btn style-2">Book Now<i className="bi bi-arrow-right"></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </section>

    );
};

export default Destination1;