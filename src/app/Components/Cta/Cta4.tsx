import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Cta4 = () => {
    return (
<section className="cta-section section-padding fix">
            <div className="container">
                <div className="row g-4">
                    <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp wow" data-wow-delay=".3s">
                        <div className="cta-box-items">
                            <div className="cta-content">
                                <h3>
                                    BATUR <br/>
                                    MOUNTAIN
                                </h3>
                                <div className="shape">
                                    <Image src="/assets/img/megh.png" alt="img" width={173} height={46}   />
                                </div>
                                <Link href="/tour/tour-details" className="theme-btn">Book Now</Link>
                            </div>
                            <div className="cta-image">
                                <Image src="/assets/img/bag.png" alt="img" width={192} height={234}   />
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp wow" data-wow-delay=".5s">
                        <div className="cta-box-items style-2">
                            <div className="cta-content">
                                <h3>
                                    Adventure <br/>
                                    awaits
                                </h3>
                                <Link href="/tour/tour-details" className="theme-btn">Book Now</Link>
                            </div>
                            <div className="cta-image">
                                <Image src="/assets/img/cta-plane.png" alt="img" width={241} height={250}   />
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp wow" data-wow-delay=".7s">
                        <div className="cta-box-items style-2 bg-color">
                            <div className="cta-content">
                                <h3>
                                    Amazing <br/>
                                    holiday
                                </h3>
                                <Link href="/tour/tour-details" className="theme-btn">Book Now</Link>
                            </div>
                            <div className="cta-image">
                                <Image src="/assets/img/cta-bag.png" alt="img" width={210} height={236}   />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section> 
    );
};

export default Cta4;