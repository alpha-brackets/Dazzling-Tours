"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const Faq1 = () => {
  const faqContent = [
    {
      title: "How do I book a tour with your agency?",
      content:
        "Nullam faucibus eleifend mi eu varius. Integer vel tincidunt massa, quis semper odio.Mauris et mollis quam. Nullam fringilla erat id ante",
    },
    {
      title: " What payment methods do you accept?",
      content:
        "Nullam faucibus eleifend mi eu varius. Integer vel tincidunt massa, quis semper odio.Mauris et mollis quam. Nullam fringilla erat id ante",
    },
    {
      title: "Can I customize my travel itinerary?",
      content:
        "Nullam faucibus eleifend mi eu varius. Integer vel tincidunt massa, quis semper odio.Mauris et mollis quam. Nullam fringilla erat id ante",
    },
    {
      title: " What is your cancellation policy?",
      content:
        "Nullam faucibus eleifend mi eu varius. Integer vel tincidunt massa, quis semper odio.Mauris et mollis quam. Nullam fringilla erat id ante",
    },
  ];

  const accordionContentRef = useRef(null);
  const [openItemIndex, setOpenItemIndex] = useState(-1);
  const [firstItemOpen, setFirstItemOpen] = useState(true);

  const handleItemClick = (index: number) => {
    if (index === openItemIndex) {
      setOpenItemIndex(-1);
    } else {
      setOpenItemIndex(index);
    }
  };
  useEffect(() => {
    if (firstItemOpen) {
      setOpenItemIndex(0);
      setFirstItemOpen(false);
    }
  }, [firstItemOpen]);

  return (
    <section className="faq-section section-padding pt-0 fix">
      <div className="left-shape float-bob-y">
        <Image
          src="/assets/img/tree-shape-2.png"
          alt="img"
          width={221}
          height={241}
        />
      </div>
      <div className="container">
        <div className="faq-wrapper">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="faq-content">
                <div className="section-title">
                  <span className="sub-title wow fadeInUp">
                    Choose Your Place
                  </span>
                  <h2 className="wow fadeInUp wow" data-wow-delay=".3s">
                    Frequently Asked Questions
                  </h2>
                </div>
                <p
                  className="mt-3 mt-mb-0 wow fadeInUp wow"
                  data-wow-delay=".5s"
                >
                  We are not just another agency – we are your digital growth
                  partners. With years of industry experience and a passion for
                  innovation, our team is dedicated to delivering measurable
                  results propel your business forward.
                </p>
                <ul className="faq-list wow fadeInUp wow" data-wow-delay=".7s">
                  <li>
                    <Image
                      src="/assets/img/icon/15.svg"
                      alt="img"
                      width={14}
                      height={12}
                    />
                    Top quality service
                  </li>
                  <li>
                    <Image
                      src="/assets/img/icon/15.svg"
                      alt="img"
                      width={14}
                      height={12}
                    />
                    Most Adventure Tour Ever
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="faq-items">
                <div className="faq-accordion">
                  <div className="accordion" id="accordion">
                    {faqContent.map((item, index) => (
                      <div
                        key={index}
                        className={`accordion-item mb-3 wow fadeInUp ${
                          index === openItemIndex ? "active" : ""
                        }`}
                        data-wow-delay=".1s"
                      >
                        <h5
                          onClick={() => handleItemClick(index)}
                          className="accordion-header"
                        >
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#faq1"
                            aria-expanded="true"
                            aria-controls="faq1"
                          >
                            {item.title}
                          </button>
                        </h5>
                        <div
                          ref={accordionContentRef}
                          id="faq1"
                          className="accordion-collapse collapse"
                          data-bs-parent="#accordion"
                        >
                          <div className="accordion-body">{item.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq1;
