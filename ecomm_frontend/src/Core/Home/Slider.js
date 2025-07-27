// ResponsiveImageSlider.jsx
import React from 'react';
import { Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const ResponsiveImageSlider = ({ images }) => (
  <Box
    sx={{
      mb: 6,
      borderRadius: 3,
      overflow: 'hidden',
      boxShadow: 3,
      width: '100%',
      maxHeight: {
        xs: 300,
        sm: 400,
        md: 500,
        lg: 600,
      },
    }}
  >
    <Swiper
      // register modules
      modules={[Autoplay, Pagination, Navigation]}

      // ============================
      // To show *all* images in one “page”:
      slidesPerView={images.length}
      // ============================

      // If you’d rather cap at 4 per view but remain responsive, swap the above
      // line for these breakpoints instead:
      //
      // breakpoints={{
      //   0:    { slidesPerView: 1 },
      //   600:  { slidesPerView: 2 },
      //   900:  { slidesPerView: 3 },
      //   1200: { slidesPerView: 4 },
      // }}

      spaceBetween={30}
      pagination={{ clickable: true }}
      navigation={true}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      centeredSlides={false}
      autoHeight={false}
      style={{ width: '100%' }}
    >
      {images.map((url, idx) => (
        <SwiperSlide
          key={idx}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={url}
            alt={`slide-${idx}`}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </Box>
);

export default ResponsiveImageSlider;

