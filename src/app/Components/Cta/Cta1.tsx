import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Cta1 = () => {
    return (
        <section className="cta-section section-padding">
        <div className="mobile-shape">
            <Image src="/assets/img/mobile.png" alt="img" width={137} height={196}   />
        </div>
        <div className="container">
            <div className="row g-4">
                <div className="col-lg-6 col-md-6 wow fadeInUp wow" data-wow-delay=".3s">
                    <div className="cta-items">
                        <div className="cta-text">
                            <h2>35% OFF</h2>
                            <p>
                                Explore The World tour <br/>
                                Hotel Booking.
                            </p>
                        </div>
                        <Link href="/tour/tour-details" className="theme-btn">BOOK NOW <i className="bi bi-arrow-right"></i></Link>
                        <div className="cta-image">
                            <Image src="/assets/img/bag-shape.png" alt="img" width={337} height={288}   />
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 wow fadeInUp wow" data-wow-delay=".5s">
                    <div className="cta-items style-2">
                        <div className="cta-text">
                            <h2>35% OFF</h2>
                            <p>
                                On Flight Ticket Grab <br/>
                                This Now.
                            </p>
                        </div>
                        <Link href="/tour/tour-details" className="theme-btn">BOOK NOW <i className="bi bi-arrow-right"></i></Link>
                        <div className="cta-image">
                            <Image src="/assets/img/plane-shape.png" alt="img" width={356} height={255}   />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    );
};

export default Cta1;