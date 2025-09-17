import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Box,
  CssBaseline,
  Typography,
  Container,
  Button,
  Card as MuiCard, // Renomeado para evitar conflito de nome
  CardContent,
  Stack
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Supondo que estes componentes existam nos seus caminhos corretos
// Se não, você precisará criá-los ou remover as importações e usos.
// Para este exemplo, vou criar mocks simples no final do arquivo se não forem providos.
import ConfirmPresence from './components/ConfirmPresence';
import ImageCarousel from './components/ImageCarousel';
import AttendeesList from './components/AttendeesList'; // Import the new component
import CountdownTimer from './components/CountdownTimer'; // Import the new component

const theme = createTheme({
  palette: {
    background: {
      default: '#FFEDC6', // verde oliva
      paper: '#FDF4E0',   // bege
    },
    primary: {
      main: '#D6BC7C', // rosa antigo
    },
    secondary: {
      main: '#FDF9E6', // rosa claro
    },
    success: {
      main: '#C19D35', // A shade of green
    },
  },
  typography: {
    h4: { fontSize: '3rem', fontFamily: 'Pacifico, cursive', fontWeight: 200 },
    h6: { fontSize: '2rem', fontFamily: 'Pacifico, cursive', fontWeight: 200 },
    body1: { fontSize: '1.4rem', fontFamily: 'Montserrat Alternates, sans-serif', fontWeight: 200 },
  },
});

const detalhes = [
  {
    titulo: 'Celebração',
    descricao: 'Venha celebrar conosco as nossas bodas de 23 anos!',
    icone: '/fofo1.png', // Mantendo seus caminhos originais
  },
  {
    titulo: 'Data',
    descricao: '27 de setembro de 2025 as 13:00',
    icone: '/fofo2.png', // Mantendo seus caminhos originais
  },
  {
    titulo: 'Local',
    descricao: 'Salão de festas do Ibi Aram 2 – Itupeva/SP',
    icone: '/fofo3.png', // Mantendo seus caminhos originais
  },
  {
    titulo: 'Atrações',
    descricao: 'Musica ao vivo! Não esqueça de levar sua bebida de preferência',
    icone: '/fofo4.png', // Mantendo seus caminhos originais
  },
];

// --- Componente DetalheCard ---
const DetalheCard = ({ item, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element); // Anima apenas uma vez
        }
      },
      {
        threshold: 0.1, // Pelo menos 10% visível para disparar
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element); // Limpa o observer ao desmontar
    };
  }, []); // Roda uma vez na montagem

  return (
    <MuiCard
      ref={cardRef}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // Coluna em telas pequenas, linha em médias/grandes
        backgroundColor: 'background.paper',
        borderRadius: 4, // Mantendo seu borderRadius original
        boxShadow: 4,    // Mantendo seu boxShadow original
        width: { xs: '100%', md: 600 }, // Adjust width for desktop, e.g., 600px or '80%'
        margin: { xs: '0', md: '0 auto' }, // Center the card on desktop
        minHeight: { xs: 'auto', md: 280 }, // Altura mínima para ajudar no aspecto "quadrado" em telas maiores
        aspectRatio: { md: '1.5 / 1' }, // Tenta manter uma proporção mais quadrada/retangular, ajuste conforme necessário
        overflow: 'hidden', // Importante para o borderRadius funcionar com a imagem

        // Efeito de surgimento
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)', // Começa um pouco abaixo
        transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
        transitionDelay: `${index * 0.18}s`, // Atraso escalonado
      }}
    >
      {/* Metade da Imagem */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' }, // Ocupa 100% da largura em telas pequenas, 50% em maiores
          height: { xs: 200, md: 'auto' }, // Altura fixa em telas pequenas, automática em maiores para preencher
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2, // Padding ao redor da imagem
          // A animação float será aplicada diretamente na imagem
        }}
      >
        <Box
          component="img"
          src={item.icone}
          alt={`Ícone: ${item.titulo}`}
          onError={(e) => {
            e.target.onerror = null; // Previne loop de erro
            e.target.src = `https://placehold.co/200x200/CCCCCC/4F4F4F?text=Imagem+Indisponivel&font=roboto`; // Fallback
          }}
          sx={{
            maxWidth: '100%',
            maxHeight: { xs: '180px', md: '240px' }, // Controla o tamanho máximo da imagem
            width: 'auto', // Garante que a proporção seja mantida
            height: 'auto',
            objectFit: 'contain',
            animation: 'float 4s ease-in-out infinite', // Sua animação float original
            borderRadius: 2, // Leve arredondamento para a imagem
          }}
        />
      </Box>

      {/* Metade do Texto */}
      <CardContent
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 2, md: 3 }, // Padding original do seu CardContent (px:3, py:4) adaptado
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Typography variant="h6" gutterBottom color="primary" sx={{ fontFamily: 'Pacifico, cursive', fontWeight: 200 }}>
          {item.titulo}
        </Typography>
        <Typography variant="body1" sx={{ fontFamily: 'Montserrat Alternates, sans-serif', fontWeight: 200 }}>{item.descricao}</Typography>
      </CardContent>
    </MuiCard>
  );
};
// --- Fim do Componente DetalheCard ---


// --- Componente App.js (Restaurado ao seu original, com DetalheCard integrado) ---
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={(
              <>
                <ImageCarousel /> {/* Carousel component with auto-cycling images */}

                <Box
                  sx={{
                    bgcolor: 'background.paper',
                    py: 3,
                    px: 2,
                    maxWidth: 'lg',
                    margin: '0 auto',
                  }}
                >
                  <Container maxWidth="md" sx={{ px: 0 }}>
                    <Typography variant="h4" gutterBottom color="primary" sx={{ fontFamily: 'Pacifico, cursive', fontWeight: 200 }}>
                      Larisse e Morácio: 23 anos de história.
                    </Typography>
                    <Stack spacing={3} sx={{ alignItems: 'center' }}>
                      {detalhes.map((item, index) => (
                        // Usando o novo DetalheCard aqui
                        <DetalheCard key={item.titulo} item={item} index={index} />
                      ))}
                    </Stack>

                    <Box sx={{ borderRadius: 2, overflow: 'hidden', height: 300, mt: 6 }}>
                      <iframe
                        title="Localização da Festa"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d29352.363734339575!2d-47.0848167!3d-23.1320133!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf314855830b91%3A0x9ddd0757c098910e!2sResidencial%20Ibi%20Aram%202!5e0!3m2!1spt-BR!2sbr!4v1748300061754!5m2!1spt-BR!2sbr" // URL de embed funcional
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </Box>

                    <Box mt={2} textAlign="center">
                      <Button
                        variant="outlined"
                        color="success"
                        href="https://www.google.com/maps/search/?api=1&query=Churrasqueira+do+beach+tennis+Ibi+Aram+2+Itupeva+SP" // Link funcional para o Google Maps
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ fontFamily: 'Montserrat Alternates, sans-serif' }}
                        size="large"
                      >
                        Ver no Google Maps
                      </Button>
                    </Box>

           

                  </Container>
                </Box>

                <Box
                  sx={{
                    bgcolor: 'background.paper', // Mantido background.paper, conforme seu código original
                    py: 3,
                    px: 2,
                    maxWidth: 'lg', // Mantido maxWidth: 'lg'
                    margin: '0 auto', // Mantido margin: '0 auto'
                  }}
                >
                  <Container maxWidth="sm" sx={{ px: 0 }}>
                    <Typography variant="h4" gutterBottom color="primary" sx={{ fontFamily: 'Pacifico, cursive', fontWeight: 200 }}>
                      Confirmar Presença
                    </Typography>
                    <ConfirmPresence /> {/* Seu componente ConfirmPresence */}

                  

                  </Container>
                </Box>

                {/* Sua animação float original, agora aplicada dentro do DetalheCard */}
                <style>
                  {`
                    @keyframes float {
                      0% { transform: translateY(0px); }
                      50% { transform: translateY(-10px); } /* Mantendo sua definição original */
                      100% { transform: translateY(0px); }
                    }
                  `}
                </style>
              </>
            )} />

            {/* New route for Attendees List page */}
            <Route path="/attendees" element={<AttendeesList />} />

          </Routes>

          {/* Add the Countdown Timer component at the end */}
          <CountdownTimer />

        </Box>
      </Router>
    </ThemeProvider>
  );
}

// --- Mocks para HeroSection e ConfirmPresence (se não existirem) ---
// Remova ou substitua se você tiver os componentes reais.
const MockHeroSection = () => (
  <Box sx={{ py: 6, bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}>
    <Typography variant="h2" sx={{ fontFamily: 'Pacifico, cursive' }}>Bem-vindos à Festa!</Typography>
  </Box>
);

const MockConfirmPresence = () => (
  <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
    <Typography variant="body1">Formulário de confirmação aqui...</Typography>
    <Button variant="contained" sx={{ mt: 2 }} size="large">Confirmar</Button>
  </Box>
);

// Use os mocks se os componentes reais não estiverem disponíveis:
// Descomente as duas linhas abaixo e comente as importações no topo se necessário.
// const HeroSection = MockHeroSection;
// const ConfirmPresence = MockConfirmPresence;

export default App;
