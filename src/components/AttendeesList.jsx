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
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const correctPassword = '250626';

  useEffect(() => {
    if (authenticated) {
      const fetchAttendees = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/attendees');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setAttendees(data);
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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setAuthenticated(true);
    } else {
      alert('Senha incorreta!'); // Simple feedback for incorrect password
      setPassword(''); // Clear password field
    }
  };

  if (!authenticated) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, bgcolor: 'background.paper', p: 4, borderRadius: 2, textAlign: 'center' }}>
        <LockOutlinedIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5" gutterBottom color="primary" sx={{ fontFamily: 'Pacifico, cursive' }}>Acesso Restrito</Typography>
        <Box component="form" onSubmit={handlePasswordSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{
              sx: { fontFamily: 'Pacifico, cursive' }
            }}
            InputProps={{
              sx: { fontFamily: 'Montserrat Alternates, sans-serif' }
            }}
          />
          <Button variant="contained" color="primary" type="submit" sx={{ fontFamily: 'Montserrat Alternates, sans-serif' }}>
            Entrar
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