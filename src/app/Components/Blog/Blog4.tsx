import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Blog4 = () => {

    const blogContent = [
        {img:'/assets/img/news/08.jpg', title:'The Surfing man Will Blow Your Mind'},
        {img:'/assets/img/news/09.jpg', title:'Supervisor Disapproved Of Latest Work'},
        {img:'/assets/img/news/10.jpg', title:'Get Best Advertiser In Your Side Pocket'},
        {img:'/assets/img/news/11.jpg', title:'The Surfing man Will Blow Your Mind'},
        {img:'/assets/img/news/12.jpg', title:'Supervisor Disapproved Of Latest Work'},
        {img:'/assets/img/news/13.jpg', title:'Get Best Advertiser In Your Side Pocket'},
      ];

    return (
        <section className="news-section section-padding fix">
            <div className="container">
                <div className="row g-4">
                {blogContent.map((item, i) => (
                    <div key={i} className="col-xl-4 col-md-6 col-lg-6 wow fadeInUp" data-wow-delay=".3s">
                        <div className="news-card-items-3 style-4">
                            <div className="news-image">
                                <Image src={item.img} alt="img" width={416} height={347}   />
                            </div>
                            <div className="news-content">
                                <ul className="post-meta">
                                    <li className="post">26<span>Nov</span></li>
                                    <li>
                                    <i className="bi bi-person"></i>
                                        By Admin
                                    </li>
                                    <li>
                                    <i className="bi bi-tag-fill"></i>
                                        Travel
                                    </li>
                                </ul>
                                <h4>
                                <Link href="/blog/blog-details">
                                    {item.title}
                                    </Link>
                                </h4>
                                <Link href="/blog/blog-details" className="link-btn">Read More <i className="bi bi-arrow-right"></i></Link>
                            </div>
                        </div>
                    </div>
                    ))}
 

                </div>
            </div>
        </section>

    );
};

export default Blog4;