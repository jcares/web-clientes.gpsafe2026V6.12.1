import React from 'react';
import { useSelector } from 'react-redux';
import { Tooltip, Zoom, Box } from '@mui/material';
import { keyframes } from '@mui/system';

const floatSoft = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
`;

const WhatsAppButton = () => {

  const user = useSelector((state) => state.session.user);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const devices = useSelector((state) => state.devices.items);

  if (!user) return null;

  const selectedDevice = devices?.find(d => d.id === selectedDeviceId);

  const deviceName = selectedDevice ? selectedDevice.name : 'sin dispositivo seleccionado';

  const message = encodeURIComponent(
    `Hola, soy ${user.name}.\n` +
    `Usuario: ${user.email || user.name}\n` +
    `Dispositivo: ${deviceName}\n` +
    `Necesito soporte GPSafe.`
  );

  return (
    <Zoom in={true}>
      <Tooltip title="Soporte WhatsApp" placement="left">
        <Box
          component="a"
          href={`https://wa.me/56984744424?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            width: 60,
            height: 60,
            backgroundColor: '#25D366',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            animation: `${floatSoft} 4s ease-in-out infinite`,
            boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
            transition: 'all .3s ease',
            '&:hover': {
              transform: 'scale(1.08)',
              boxShadow: '0 8px 22px rgba(0,0,0,0.35)',
            }
          }}
        >
          <Box
            component="img"
            src="/images/whatsapp.svg"
            alt="WhatsApp"
            sx={{
              width: 30,
              height: 30
            }}
          />
        </Box>
      </Tooltip>
    </Zoom>
  );
};

export default WhatsAppButton;