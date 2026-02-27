import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, TextField, Typography, Snackbar, IconButton } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoginLayout from './LoginLayout';
import { useTranslation } from '../common/components/LocalizationProvider';
import { snackBarDurationShortMs } from '../common/util/duration';
import fetchOrThrow from '../common/util/fetchOrThrow';
import { useCatch } from '../reactHelper';
import BackIcon from '../common/components/BackIcon';
import { sessionActions } from '../store';

const useStyles = makeStyles()((theme) => ({
  rootBackground: {
    minHeight: '100vh',
    width: '100%',
    backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(/background-login.png)`,
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
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2.5),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: theme.spacing(3),
    fontWeight: 500,
    marginLeft: theme.spacing(1),
    textTransform: 'uppercase',
  },
  submitButton: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1.4),
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '15px',
  },
}));

const ResetPasswordPage = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('passwordReset');

  const server = useSelector((state) => state.session.server);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = useCatch(async (event) => {
    event.preventDefault();

    if (!token) {
      await fetchOrThrow('/api/password/reset', {
        method: 'POST',
        body: new URLSearchParams({ email }),
      });
    } else {
      await fetchOrThrow('/api/password/update', {
        method: 'POST',
        body: new URLSearchParams({ token, password }),
      });
    }

    setSnackbarOpen(true);
  });

  const isSubmitDisabled = !token
    ? !/(.+)@(.+)\.(.{2,})/.test(email)
    : !password;

  return (
    <div className={classes.rootBackground}>
      <div className={classes.glassCard}>
        <div className={classes.header}>
          {!server.newServer && (
            <IconButton color="primary" onClick={() => navigate('/login')}>
              <BackIcon />
            </IconButton>
          )}
          <Typography className={classes.title} color="primary">
            {t('loginReset')}
          </Typography>
        </div>

        {!token ? (
          <TextField
            required
            type="email"
            label={t('userEmail')}
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            autoFocus
          />
        ) : (
          <TextField
            required
            type="password"
            label={t('userPassword')}
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            autoFocus
          />
        )}

        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          type="submit"
          disabled={isSubmitDisabled}
          className={classes.submitButton}
          fullWidth
        >
          {t('loginReset')}
        </Button>
      </div>

      <Snackbar
        open={snackbarOpen}
        onClose={() => {
          dispatch(sessionActions.updateServer({ ...server, newServer: false }));
          navigate('/login');
        }}
        autoHideDuration={snackBarDurationShortMs}
        message={!token ? t('loginResetSuccess') : t('loginUpdateSuccess')}
      />
    </div>
  );
};

export default ResetPasswordPage;