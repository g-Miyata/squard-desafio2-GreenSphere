import { Splide, SplideSlide } from '@splidejs/react-splide';
import { FC } from 'react';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import '@splidejs/splide/dist/css/splide.min.css';
import style from './Splide.module.css';
import { useSplide } from '../../hooks/useSplide';
import { Link } from 'react-router-dom';
import useFetchPlants from '../../hooks/useFetchPlant/useFetchPlants';
import Label from '../Label/Label';
import { CarouselProps } from './Splide.types';

const ImageCarousel: FC<CarouselProps> = ({ type }) => {
  const numberOfSlides = useSplide();
  const { data: plants, loading, error } = useFetchPlants('https://run.mocky.io/v3/5371015a-8bee-41cc-a419-3c9b71404b58');

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  const plantsInSale = plants?.filter((plant) => plant.isInSale) || [];
  const bestSelling =
    plants?.filter((plant) => {
      const priceAsNumber = parseFloat(plant.price.replace('$', ''));
      return priceAsNumber < 50;
    }) || [];

  const carouselContent = type === 'plantsInSale' ? plantsInSale : bestSelling;

  return (
    <Splide
      options={{
        type: 'loop',
        perPage: numberOfSlides,
        drag: 'free',
        pagination: false,
        arrows: false,
        autoScroll: {
          speed: 0.5,
        },
      }}
      extensions={{ AutoScroll }}
      aria-label="Plant Carousel"
    >
      {carouselContent.length > 0 ? (
        carouselContent.map((plant) => (
          <SplideSlide key={plant.id}>
            <Link to={`/Plant/${plant.id}`} className={style.container}>
              <div className={style.splideBody}>
                <div className={style.imgContainer}>
                  <img src={plant.imgUrl} alt={plant.name} />
                </div>
                <div>
                  <p>{plant.name}</p>
                  <small>{plant.price}</small>
                </div>
                <div className={style.label}>
                  {plant.label.map((label, index) => (
                    <Label key={index} text={label} />
                  ))}
                </div>
              </div>
            </Link>
          </SplideSlide>
        ))
      ) : (
        <p>No plants available for sale.</p>
      )}
    </Splide>
  );
};

export default ImageCarousel;
