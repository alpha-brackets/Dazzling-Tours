const fs = require('fs');

function fixState(file) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Remove the old useEffect that uses setNav1
  const oldEffectRegex = /useEffect\(\(\) => {[\s\S]*?setNav1\(slider1\.current\);[\s\S]*?setNav2\(slider2\.current\);[\s\S]*?}, \[\]\);/;
  
  content = content.replace(oldEffectRegex, '');
  console.log('Removed old useEffect');

  // 2. Add currentSlide and the new useEffect after setThumbApi
  const stateRegex = /const \[thumbApi, setThumbApi\] = useState<CarouselApi>\(\);/;
  const newStateBlock = `const [thumbApi, setThumbApi] = useState<CarouselApi>();
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
  console.log('Added new state and effect');

  fs.writeFileSync(file, content, 'utf8');
}

fixState('./src/app/Components/TourDetails/TourDetails.tsx');
