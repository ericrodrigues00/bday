import { useState } from 'react';
import {
  Box, Button, TextField, Stack, IconButton, LinearProgress, Typography, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

function ConfirmPresence() {
  const [names, setNames] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const addGuest = () => {
    setNames([...names, '']);
  };

  const handleSubmit = async () => {
    const accessCode = 'verlista';
    const firstInput = names[0] ? names[0].trim().toLowerCase() : '';

    if (firstInput === accessCode) {
      navigate('/attendees'); // Redirect to attendees list if access code matches
      return; // Stop further execution
    }

    // Limpar mensagens anteriores
    setSuccessMessage('');
    setErrorMessage('');
    setIsLoading(true);

    console.log('Confirmado:', names);
    
    try {
      // Criar um timeout de 5 segundos
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );

      const fetchPromise = fetch('https://bday-backend.onrender.com/api/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ names: names.filter(name => name.trim() !== '') }), // Send non-empty names
      });

      // Race entre fetch e timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      const data = await response.json();

      if (response.ok) {
        console.log('Success:', data);
        setSuccessMessage('Presença confirmada com sucesso!');
        setNames(['']); // Reset form after successful submission
      } else {
        console.error('Error:', data);
        setErrorMessage(`Erro ao confirmar presença: ${data.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.message === 'Timeout') {
        setErrorMessage('Um erro ocorreu, por favor tente novamente');
      } else {
        setErrorMessage('Erro ao conectar com o servidor');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      {names.map((name, index) => (
        <TextField
          key={index}
          label={`Nome ${index === 0 ? 'do convidado' : `acompanhante ${index}`}`}
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => handleChange(index, e.target.value)}
          disabled={isLoading}
          InputLabelProps={{
            sx: { fontFamily: 'Montserrat Alternates, sans-serif' }
          }}
          InputProps={{
            sx: { fontFamily: 'Montserrat Alternates, sans-serif' }
          }}
        />
      ))}
      
      {/* Barra de progresso durante loading */}
      {isLoading && (
        <Box>
          <LinearProgress 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              backgroundColor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#C19D35'
              }
            }} 
          />
          <Typography 
            variant="body2" 
            textAlign="center" 
            sx={{ 
              mt: 1, 
              fontFamily: 'Montserrat Alternates, sans-serif',
              fontWeight: 200,
              color: 'text.secondary'
            }}
          >
            Enviando...
          </Typography>
        </Box>
      )}

      {/* Mensagem de sucesso */}
      {successMessage && (
        <Alert 
          severity="success" 
          sx={{ 
            fontFamily: 'Montserrat Alternates, sans-serif',
            fontWeight: 200
          }}
        >
          {successMessage}
        </Alert>
      )}

      {/* Mensagem de erro */}
      {errorMessage && (
        <Alert 
          severity="error" 
          sx={{ 
            fontFamily: 'Montserrat Alternates, sans-serif',
            fontWeight: 200
          }}
        >
          {errorMessage}
        </Alert>
      )}
      
      <Box textAlign="center">
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          size="large"
          disabled={isLoading}
          sx={{ 
            fontFamily: 'Montserrat Alternates, sans-serif',
            fontWeight: 200,
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? 'Enviando...' : 'Confirmar'}
        </Button>
      </Box>
    </Stack>
  );
}

export default ConfirmPresence;
