const fs = require('fs');

function refactorTourDetails(file) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Replace imports
  content = content.replace(
    /import Slider from "react-slick";/g,
    'import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";'
  );

  // 2. Replace state
  content = content.replace(
    /  const \[nav1, setNav1\] = useState<Slider \| null>\(null\);\s+const \[nav2, setNav2\] = useState<Slider \| null>\(null\);\s+const slider1 = useRef<Slider \| null>\(null\);\s+const slider2 = useRef<Slider \| null>\(null\);/g,
    `  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();`
  );

  // Wait, the state might be spread across lines or formatted differently.
  // Let's use a safer regex or string replacement.
  
  // Let's search for the state lines specifically.
  const stateBlock = `const [nav1, setNav1] = useState<Slider | null>(null);
  const [nav2, setNav2] = useState<Slider | null>(null);
  const slider1 = useRef<Slider | null>(null);
  const slider2 = useRef<Slider | null>(null);`;
  
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

  if (content.includes(stateBlock)) {
    content = content.replace(stateBlock, newStateBlock);
  } else {
    console.log('State block not found, trying regex');
    // Fallback to regex or manual search if needed
  }

  // 3. Remove settings
  const settingsBlock = `const mainSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: nav2 ?? undefined,
  };

  const thumbSettings = {
    slidesToShow: Math.min(tour.images?.length || 0, 5),
    slidesToScroll: 1,
    asNavFor: nav1 ?? undefined,
    dots: false,
    centerMode: false,`;
    
  // The settings block might be longer. Let's find the end of thumbSettings.
  // Let's use a broader search or just remove the lines if we can.
  
  // Let's check if we can find the start of settings.
  const settingsStart = content.indexOf('const mainSettings = {');
  const settingsEnd = content.indexOf('focusOnSelect: true,') + 'focusOnSelect: true,'.length;
  // Wait, let's look at lines 167-180.
  // It has `focusOnSelect: true,` likely.
  
  // Let's use a script that reads the file, finds the carousel block, and replaces it.
  // And also removes the state and settings if found.
  
  // Let's do a targeted replacement for the Carousel block first, as it's the biggest part.
  
  const galleryBlock = `<div className="tour-gallery-container mb-5">`;
  const galleryEndBlock = `</div>
                <div className="activities-details-content">`;
                
  const startIndex = content.indexOf(galleryBlock);
  const endIndex = content.indexOf(galleryEndBlock);
  
  if (startIndex !== -1 && endIndex !== -1) {
    const originalGallery = content.substring(startIndex, endIndex + `</div>`.length);
    
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
                            <div className="main-slider-item">
                              <div
                                className="image-overlay-trigger"
                                onClick={() => handleOpenLightbox(idx)}
                              >
                                <Icon name="expand" />
                                <span>View Gallery</span>
                              </div>
                              <Image
                                src={img || \`\${IMAGEKIT_URL_ENDPOINT}/assets/img/hero/hero1.webp\`}
                                alt={\`\${tour.title} - \${idx + 1}\`}
                                fill
                                priority={idx === 0}
                                className="rounded-4 shadow-sm"
                                style={{ objectFit: "cover" }}
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
                              <div className={\`thumb-slider-item \${currentSlide === idx ? 'ring-2 ring-[var(--primary)]' : ''}\`}>
                                <Image
                                  src={img}
                                  alt={\`\${tour.title} thumb - \${idx + 1}\`}
                                  fill
                                  className="rounded-3 shadow-sm"
                                  style={{
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </div>
                  )}
                </div>`;
                
    content = content.replace(originalGallery, newGallery);
    console.log('Replaced gallery block');
  }

  // Now let's try to remove the old state and settings if we can find them.
  // Or we can just let the build fail if they are unused variables?
  // No, we should clean them up if possible.
  
  fs.writeFileSync(file, content, 'utf8');
}

refactorTourDetails('./src/app/Components/TourDetails/TourDetails.tsx');
