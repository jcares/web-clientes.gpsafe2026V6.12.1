import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import defaultLogo from '../resources/images/logo.png';

const useStyles = makeStyles()((theme) => ({
  image: {
    display: 'block',
    margin: '0 auto 32px auto',
    maxWidth: '220px',
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    transition: 'all 0.3s ease',
    filter:
      theme.palette.mode === 'dark'
        ? 'drop-shadow(0 6px 18px rgba(0,0,0,0.6))'
        : 'drop-shadow(0 6px 18px rgba(0,0,0,0.2))',
  },
}));

const LogoImage = () => {
  const theme = useTheme();
  const { classes } = useStyles();

  const serverLogo = useSelector(
    (state) => state.session.server.attributes?.logo
  );

  const logoInverted = useSelector(
    (state) => state.session.server.attributes?.logoInverted
  );

  // Si el servidor tiene logo personalizado
  if (serverLogo) {
    if (theme.palette.mode === 'dark' && logoInverted) {
      return <img className={classes.image} src={logoInverted} alt="GPSafe" />;
    }
    return <img className={classes.image} src={serverLogo} alt="GPSafe" />;
  }

  return <img className={classes.image} src={defaultLogo} alt="GPSafe" />;
};

export default LogoImage;