import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Blog2 = () => {

    const blogContent = [
        {img:'/assets/img/news/04.jpg', title:'Ultimate Guide to Planning Your Dream Vacation'},
        {img:'/assets/img/news/05.jpg', title:'Unforgettable Adventures Travel Agency Bucket List Experiences'},
        {img:'/assets/img/news/06.jpg', title:'Exploring Culture and way Cuisine Travel Agency'},
        {img:'/assets/img/news/07.jpg', title:'Travel Agency is they Best Foodie Destinations'},
      ];

    return (
<section className="news-section-2 section-padding fix">
            <div className="container-fluid">
                <div className="section-title text-center">
                    <span className="sub-title wow fadeInUp">
                        News & Updates
                    </span>
                    <h2 className="wow fadeInUp wow" data-wow-delay=".2s">
                        Our Latest News & Articles
                    </h2>
                </div>
                <div className="row">
                {blogContent.map((item, i) => (
                    <div key={i} className="col-xxl-3 col-xl-4 col-md-6 col-lg-6 wow fadeInUp wow" data-wow-delay=".2s">
                        <div className="news-card-items-2">
                            <div className="news-image">
                                <Image src={item.img} alt="img" width={376} height={268}   />
                            </div>
                            <div className="news-content">
                                <ul className="post-meta">
                                    <li>
                                    <i className="bi bi-chat"></i>
                                        0 Comment
                                    </li>
                                    <li>
                                    <i className="bi bi-calendar"></i>
                                        September 6, 2024
                                    </li>
                                </ul>
                                <h4>
                                <Link href="/blog/blog-details">
                                    {item.title}
                                    </Link>
                                </h4>
                                <div className="news-info">
                                    <Link href="/blog/blog-details" className="link-btn style-2">Read More <i className="bi bi-arrow-right"></i></Link>
                                    <div className="group-image">
                                        <Image src="/assets/img/news/Group.png" alt="img" width={103} height={30}   />
                                    </div>
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

export default Blog2;