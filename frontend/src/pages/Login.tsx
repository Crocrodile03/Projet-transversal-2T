import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './css/Auth.module.css'

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs.')
      return
    }

    // TODO: appel API d'authentification
    console.log('Login:', { username, password })
  }

  return (
    <div className={styles.desktop}>
      <div className={styles.dialog}>

        {/* Barre de titre XP */}
        <div className={styles.titleBar}>
          <span className={styles.titleText}>🔐 Connexion</span>
          <button className={styles.closeBtn} onClick={() => navigate('/')}>✕</button>
        </div>

        {/* Corps */}
        <div className={styles.body}>
          <div className={styles.iconRow}>
            <span className={styles.userIcon}>👤</span>
            <div>
              <div className={styles.welcomeTitle}>Bienvenue !</div>
              <div className={styles.welcomeSub}>Connectez-vous à votre compte.</div>
            </div>
          </div>

          <hr className={styles.sep} />

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="username">Nom d'utilisateur</label>
              <input
                id="username"
                className={`${styles.input}${error ? ' ' + styles.inputError : ''}`}
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">Mot de passe</label>
              <input
                id="password"
                className={`${styles.input}${error ? ' ' + styles.inputError : ''}`}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              {error && <div className={styles.errorMsg}>⚠ {error}</div>}
            </div>

            <hr className={styles.sep} />

            <div className={styles.btnRow}>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                Connexion →
              </button>
            </div>
          </form>

          <div className={styles.linkRow}>
            Pas encore de compte ?{' '}
            <button className={styles.link} onClick={() => navigate('/register')}>
              Créer un compte
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login
