import { Box } from '@mui/material';

function HeroSection() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '40vh',
        backgroundImage: 'url("/banner.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}

export default HeroSection;
