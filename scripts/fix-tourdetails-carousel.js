const fs = require('fs');

function fixTourDetails(file) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Replace state
  const stateRegex = /const \[nav1, setNav1\] = useState<Slider \| null>\(null\);[\s\S]*?const slider2 = useRef<Slider \| null>\(null\);/;
  const newStateBlock = `const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!mainApi || !thumbApi) return;
    
    const onSelect = () => {
      const index = mainApi.selectedScrollSnap();
      setCurrentSlide(index);
      thumbApi.scrollTo(index);
    };
    
    mainApi.on('select', onSelect);
    return () => {
      mainApi.off('select', onSelect);
    };
  }, [mainApi, thumbApi]);`;

  content = content.replace(stateRegex, newStateBlock);

  // 2. Remove settings
  const settingsRegex = /const mainSettings = {[\s\S]*?asNavFor: nav1 \?\? undefined,[\s\S]*?};/;
  // Wait, the settings block is long and has responsive arrays.
  // Let's use a more specific regex or just find the indices.
  
  const settingsStart = content.indexOf('const mainSettings = {');
  const settingsEnd = content.indexOf('return (', settingsStart);
  
  if (settingsStart !== -1 && settingsEnd !== -1) {
    content = content.substring(0, settingsStart) + content.substring(settingsEnd);
    console.log('Removed settings block');
  }

  // 3. Replace gallery block
  const galleryRegex = /<div className="tour-gallery-container mb-5">[\s\S]*?<div className="activities-details-content">/;
  const newGallery = `<div className="tour-gallery-container mb-5">
                  <div className="main-slider-wrap position-relative">
                    <Carousel
                      setApi={setMainApi}
                      className="w-full"
                      opts={{
                        loop: true,
                      }}
                    >
                      <CarouselContent>
                        {tour.images?.map((img, idx) => (
                          <CarouselItem key={idx}>
                            <div className="main-slider-item h-[400px] md:h-[500px] relative">
                              <div
                                className="image-overlay-trigger absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full cursor-pointer"
                                onClick={() => handleOpenLightbox(idx)}
                              >
                                <Icon name="expand" className="text-white" />
                              </div>
                              <Image
                                src={img || \`\${IMAGEKIT_URL_ENDPOINT}/assets/img/hero/hero1.webp\`}
                                alt={\`\${tour.title} - \${idx + 1}\`}
                                fill
                                priority={idx === 0}
                                className="rounded-xl shadow-sm object-cover"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>

                  {tour.images && tour.images.length > 1 && (
                    <div className="thumb-slider-wrap mt-3">
                      <Carousel
                        setApi={setThumbApi}
                        className="w-full"
                        opts={{
                          containScroll: "keepSnaps",
                          dragFree: true,
                        }}
                      >
                        <CarouselContent className="-ml-2">
                          {tour.images.map((img, idx) => (
                            <CarouselItem key={idx} className="pl-2 basis-1/5" onClick={() => mainApi?.scrollTo(idx)}>
                              <div className={\`thumb-slider-item h-20 relative cursor-pointer \${currentSlide === idx ? 'ring-2 ring-[var(--theme)]' : ''}\`}>
                                <Image
                                  src={img}
                                  alt={\`\${tour.title} thumb - \${idx + 1}\`}
                                  fill
                                  className="rounded-lg shadow-sm object-cover"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </div>
                  )}
                </div>
                <div className="activities-details-content">`;

  content = content.replace(galleryRegex, newGallery);

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed TourDetails.tsx');
}

fixTourDetails('./src/app/Components/TourDetails/TourDetails.tsx');
