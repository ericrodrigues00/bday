import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  Button
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function AttendeesList() {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputText, setInputText] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const correctInput = 'verlista';

  useEffect(() => {
    if (authenticated) {
      const fetchAttendees = async () => {
        try {
          const response = await fetch('https://bday-backend.onrender.com/api/attendees');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          
          // Filter attendees who confirmed on September 16, 2025 or later and remove duplicates
          const september16_2025 = new Date('2025-09-16T00:00:00Z');
          
          const filteredAttendees = data
            .filter((attendee) => {
              // Filter by date: only show attendees who confirmed on September 16, 2025 or later
              const confirmDate = new Date(attendee.timestamp);
              return confirmDate >= september16_2025;
            })
            .filter((attendee, index, array) => {
              // Remove duplicates by checking if this is the first occurrence of this name
              return array.findIndex(item => item.name === attendee.name) === index;
            });
          
          setAttendees(filteredAttendees);
        } catch (error) {
          console.error('Error fetching attendees:', error);
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchAttendees();
    }
  }, [authenticated]); // Fetch attendees only when authenticated changes to true

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (inputText.toLowerCase().trim() === correctInput) {
      setAuthenticated(true);
    } else {
      alert('Digite "verlista" para acessar!'); // Simple feedback for incorrect input
      setInputText(''); // Clear input field
    }
  };

  if (!authenticated) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, bgcolor: 'background.paper', p: 4, borderRadius: 2, textAlign: 'center' }}>
        <LockOutlinedIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5" gutterBottom color="primary" sx={{ fontFamily: 'Pacifico, cursive' }}>Ver Lista de Confirmados</Typography>
        <Box component="form" onSubmit={handleInputSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Digite 'verlista'"
            type="text"
            variant="outlined"
            fullWidth
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            InputLabelProps={{
              sx: { fontFamily: 'Pacifico, cursive' }
            }}
            InputProps={{
              sx: { fontFamily: 'Montserrat Alternates, sans-serif' }
            }}
          />
          <Button variant="contained" color="primary" type="submit" sx={{ fontFamily: 'Montserrat Alternates, sans-serif' }}>
            CONFIRMAR
          </Button>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ fontFamily: 'Montserrat Alternates, sans-serif' }}>Loading attendees...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ fontFamily: 'Montserrat Alternates, sans-serif' }}>Error loading attendees: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, bgcolor: 'background.paper', py: 3, px: 2, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ textAlign: 'center', fontFamily: 'Pacifico, cursive' }}>Lista de Presença Confirmada</Typography>
      <Typography variant="h6" gutterBottom color="primary" sx={{ textAlign: 'center', fontFamily: 'Montserrat Alternates, sans-serif', mb: 3 }}>
        Total de Confirmações: {attendees.length}
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ minWidth: 300 }} aria-label="attendees table">
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.light' }}>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText', fontFamily: 'Montserrat Alternates, sans-serif' }}>Nome</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.contrastText', fontFamily: 'Montserrat Alternates, sans-serif' }}>Horário de Confirmação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendees.map((attendee, index) => (
              <TableRow
                key={attendee._id}
                sx={{
                  '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component="th" scope="row" sx={{ color: 'text.primary', fontFamily: 'Montserrat Alternates, sans-serif' }}>
                  {attendee.name}
                </TableCell>
                <TableCell align="right" sx={{ color: 'text.primary', fontFamily: 'Montserrat Alternates, sans-serif' }}>{new Date(attendee.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {attendees.length === 0 && (
        <Typography variant="body1" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary', fontFamily: 'Montserrat Alternates, sans-serif' }}>
          Nenhum convidado confirmado ainda.
        </Typography>
      )}
    </Container>
  );
}

export default AttendeesList; 