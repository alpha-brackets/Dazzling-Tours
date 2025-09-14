import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Blog1 = () => {
    return (
        <section className="news-section section-padding fix">
            <div className="container">
                <div className="section-title text-center">
                    <span className="sub-title wow fadeInUp">
                        News & Updates
                    </span>
                    <h2 className="wow fadeInUp wow" data-wow-delay=".2s">
                        Our Latest News & Articles
                    </h2>
                </div>
                <div className="row">
                    <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp wow" data-wow-delay=".3s">
                        <div className="news-card-items">
                            <div className="news-image">
                                 <Image src="/assets/img/news/01.jpg" alt="img" width={416} height={260}   />
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp wow" data-wow-delay=".5s">
                        <div className="news-card-items">
                            <div className="news-content">
                                <ul className="post-meta">
                                    <li>
                                    <i className="bi bi-calendar"></i>
                                        December 02, 2024
                                    </li>
                                    <li>
                                    <i className="bi bi-tag-fill"></i>
                                        New york City
                                    </li>
                                </ul>
                                <h3>
                                    <Link href="/blog/blog-details">
                                        Including Animation In Your
                                        Design System
                                    </Link>
                                </h3>
                                <Link href="/blog/blog-details" className="link-btn">Read More <i className="bi bi-arrow-right"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp wow" data-wow-delay=".7s">
                        <div className="news-card-items">
                            <div className="news-image">
                                <Image src="/assets/img/news/02.jpg" alt="img" width={416} height={260}   />
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp wow" data-wow-delay=".3s">
                        <div className="news-card-items">
                            <div className="news-content">
                                <ul className="post-meta">
                                    <li>
                                    <i className="bi bi-calendar"></i>
                                        December 02, 2024
                                    </li>
                                    <li>
                                    <i className="bi bi-tag-fill"></i>
                                        New york City
                                    </li>
                                </ul>
                                <h3>
                                <Link href="/blog/blog-details">
                                        Including Animation In Your
                                        Design System
                                    </Link>
                                </h3>
                                <Link href="/blog/blog-details" className="link-btn">Read More <i className="bi bi-arrow-right"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp wow" data-wow-delay=".5s">
                        <div className="news-card-items">
                            <div className="news-image">
                                <Image src="/assets/img/news/02.jpg" alt="img" width={416} height={260}   />
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp wow" data-wow-delay=".7s">
                        <div className="news-card-items">
                            <div className="news-content">
                                <ul className="post-meta">
                                    <li>
                                    <i className="bi bi-calendar"></i>
                                        December 02, 2024
                                    </li>
                                    <li>
                                    <i className="bi bi-tag-fill"></i>
                                        New york City
                                    </li>
                                </ul>
                                <h3>
                                <Link href="/blog/blog-details">
                                        Including Animation In Your
                                        Design System
                                    </Link>
                                </h3>
                                <Link href="/blog/blog-details" className="link-btn">Read More <i className="bi bi-arrow-right"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Blog1;