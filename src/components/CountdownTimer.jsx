import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

function CountdownTimer() {
  // Target date and time: September 27, 2025, 2 PM GMT-3
  // In UTC, this is September 27, 2025, 5 PM (17:00)
  const targetDate = new Date(Date.UTC(2025, 8, 27, 17, 0, 0));

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
  const theme = useTheme();

  function calculateTimeRemaining() {
    const now = new Date().getTime();
    const difference = targetDate.getTime() - now;

    if (difference < 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        py: 4,
        px: 2,
        maxWidth: 'lg',
        margin: '0 auto',
        textAlign: 'center',
        boxShadow: 3, // Add some shadow
      }}
    >
      <Typography variant="h4" gutterBottom color="primary" sx={{ fontFamily: theme.typography.h4.fontFamily }}>
        Contagem Regressiva
      </Typography>
      {timeRemaining.isExpired ? (
        <Typography variant="h6" color="primary" sx={{ fontFamily: theme.typography.h6.fontFamily }}>
          O evento começou!
        </Typography>
      ) : (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }} justifyContent="center" alignItems="center">
          <Box>
            <Typography variant="h6" color="primary" sx={{ fontFamily: theme.typography.h6.fontFamily }}>{timeRemaining.days}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontFamily: theme.typography.body1.fontFamily }}>Dias</Typography>
          </Box>
          <Box>
            <Typography variant="h6" color="primary" sx={{ fontFamily: theme.typography.h6.fontFamily }}>{timeRemaining.hours}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontFamily: theme.typography.body1.fontFamily }}>Horas</Typography>
          </Box>
          <Box>
            <Typography variant="h6" color="primary" sx={{ fontFamily: theme.typography.h6.fontFamily }}>{timeRemaining.minutes}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontFamily: theme.typography.body1.fontFamily }}>Minutos</Typography>
          </Box>
          <Box>
            <Typography variant="h6" color="primary" sx={{ fontFamily: theme.typography.h6.fontFamily }}>{timeRemaining.seconds}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontFamily: theme.typography.body1.fontFamily }}>Segundos</Typography>
          </Box>
        </Stack>
      )}
    </Box>
  );
}

export default CountdownTimer; 