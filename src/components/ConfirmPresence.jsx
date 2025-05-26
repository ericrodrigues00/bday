import { useState } from 'react';
import {
  Box, Button, TextField, Stack, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function ConfirmPresence() {
  const [names, setNames] = useState(['']);

  const handleChange = (index, value) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const addGuest = () => {
    setNames([...names, '']);
  };

  const handleSubmit = async () => {
    console.log('Confirmado:', names);
    // Aqui será conectado com o backend depois
    try {
      const response = await fetch('http://localhost:5000/api/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ names: names.filter(name => name.trim() !== '') }), // Send non-empty names
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Success:', data);
        alert('Presença confirmada com sucesso!'); // Or a more sophisticated UI feedback
        setNames(['']); // Reset form after successful submission
      } else {
        console.error('Error:', data);
        alert(`Erro ao confirmar presença: ${data.message || response.statusText}`); // Show error message
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao conectar com o servidor.');
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
        />
      ))}
      <Box display="flex" justifyContent="flex-start">
       
      </Box>
      <Box textAlign="center">
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          size="large"
        >
          Confirmar
        </Button>
      </Box>
    </Stack>
  );
}

export default ConfirmPresence;
