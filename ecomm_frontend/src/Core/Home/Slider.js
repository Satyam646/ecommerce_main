// src/Components/Slider.js
import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const ResponsiveImageSlider = ({ images = [] }) => {
  const theme = useTheme();
  // breakpoint flags
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  // dynamic sizing
  const height = isXs ? 200 : isMdUp ? 400 : 300;
  const spacing = isXs ? 8 : 16;
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1440,
        mx: 'auto',
        my: 4,
        // maintain aspect ratio container
        aspectRatio: `${3}/${1}`,
        position: 'relative',
      }}
    >
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        spaceBetween={spacing}
        loop
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        style={{ width: '100%', height: '100%' }}
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx}>
            <Box
              component="img"
              src={src}
              alt={`banner-${idx}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: '',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default ResponsiveImageSlider;
