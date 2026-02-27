import { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Link,
  Snackbar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionActions } from '../store';
import { useTranslation } from '../common/components/LocalizationProvider';
import LogoImage from './LogoImage';
import usePersistedState from '../common/util/usePersistedState';
import { generateLoginToken, nativePostMessage } from '../common/components/NativeInterface';
import QrCodeDialog from '../common/components/QrCodeDialog';
import fetchOrThrow from '../common/util/fetchOrThrow';

const useStyles = makeStyles()((theme) => ({
  rootBackground: {
    minHeight: '100vh',
    width: '100%',
    backgroundImage: `
      linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
      url(/background-login.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },

  glassCard: {
    backdropFilter: 'blur(25px)',
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(15,15,15,0.85)'
        : 'rgba(255,255,255,0.92)',
    padding: theme.spacing(6),
    borderRadius: '24px',
    boxShadow: '0 40px 100px rgba(0,0,0,0.45)',
    width: '100%',
    maxWidth: '460px',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2.5),
  },

  loginButton: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1.4),
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '15px',
  },

  extraContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
    fontSize: '0.9rem',
  },

  link: {
    cursor: 'pointer',
    fontWeight: 500,
  },
}));

const LoginPage = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();

  const [failed, setFailed] = useState(false);
  const [email, setEmail] = usePersistedState('loginEmail', '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const registrationEnabled = useSelector((state) => state.session.server.registration);
  const emailEnabled = useSelector((state) => state.session.server.emailEnabled);

  useEffect(() => nativePostMessage('authentication'), []);

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    setFailed(false);

    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        body: new URLSearchParams({
          email,
          password,
        }),
      });

      if (!response.ok) throw Error();

      const user = await response.json();
      generateLoginToken();
      dispatch(sessionActions.updateUser(user));
      navigate('/');
    } catch {
      setFailed(true);
      setPassword('');
    }
  };

  return (
    <div className={classes.rootBackground}>
      <div className={classes.glassCard}>
        <LogoImage />

        <TextField
          required
          error={failed}
          label={t('userEmail')}
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        <TextField
          required
          error={failed}
          label={t('userPassword')}
          value={password}
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          onClick={handlePasswordLogin}
          variant="contained"
          color="secondary"
          className={classes.loginButton}
          disabled={!email || !password}
          fullWidth
        >
          {t('loginLogin')}
        </Button>

        <div className={classes.extraContainer}>
          {registrationEnabled && (
            <Link onClick={() => navigate('/register')} className={classes.link}>
              {t('loginRegister')}
            </Link>
          )}
          {emailEnabled && (
            <Link onClick={() => navigate('/reset-password')} className={classes.link}>
              {t('loginReset')}
            </Link>
          )}
        </div>

        <QrCodeDialog open={showQr} onClose={() => setShowQr(false)} />

        <Snackbar
          open={failed}
          message="Credenciales incorrectas"
          action={
            <IconButton size="small" color="inherit" onClick={() => setFailed(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </div>
    </div>
  );
};

export default LoginPage;