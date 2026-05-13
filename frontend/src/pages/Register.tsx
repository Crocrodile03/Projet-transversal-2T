import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './css/Auth.module.css'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirm: '',
  })
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  function update(field: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  function validate(): boolean {
    const e: Partial<typeof form> = {}
    if (!form.username.trim()) e.username = 'Champ requis.'
    if (!form.password) e.password = 'Champ requis.'
    else if (form.password.length < 6) e.password = '6 caractères minimum.'
    if (form.confirm !== form.password) e.confirm = 'Les mots de passe ne correspondent pas.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    // TODO: appel API de création de compte
    console.log('Register:', { username: form.username })
  }

  return (
    <div className={styles.desktop}>
      <div className={styles.dialog}>

        {/* Barre de titre XP */}
        <div className={styles.titleBar}>
          <span className={styles.titleText}>🧾 Créer un compte</span>
          <button className={styles.closeBtn} onClick={() => navigate('/')}>✕</button>
        </div>

        {/* Corps */}
        <div className={styles.body}>
          <div className={styles.iconRow}>
            <span className={styles.userIcon}>🆕</span>
            <div>
              <div className={styles.welcomeTitle}>Nouveau compte</div>
              <div className={styles.welcomeSub}>Remplissez le formulaire ci-dessous.</div>
            </div>
          </div>

          <hr className={styles.sep} />

          <form onSubmit={handleSubmit} noValidate>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="username">Nom d'utilisateur</label>
              <input
                id="username"
                className={`${styles.input}${errors.username ? ' ' + styles.inputError : ''}`}
                type="text"
                value={form.username}
                onChange={e => update('username', e.target.value)}
                autoComplete="username"
                autoFocus
              />
              {errors.username && <div className={styles.errorMsg}>⚠ {errors.username}</div>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">Mot de passe</label>
              <input
                id="password"
                className={`${styles.input}${errors.password ? ' ' + styles.inputError : ''}`}
                type="password"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                autoComplete="new-password"
              />
              {errors.password && <div className={styles.errorMsg}>⚠ {errors.password}</div>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="confirm">Confirmer le mot de passe</label>
              <input
                id="confirm"
                className={`${styles.input}${errors.confirm ? ' ' + styles.inputError : ''}`}
                type="password"
                value={form.confirm}
                onChange={e => update('confirm', e.target.value)}
                autoComplete="new-password"
              />
              {errors.confirm && <div className={styles.errorMsg}>⚠ {errors.confirm}</div>}
            </div>

            <hr className={styles.sep} />

            <div className={styles.btnRow}>
              <button type="button" className={styles.btn} onClick={() => navigate('/login')}>
                Annuler
              </button>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                Créer →
              </button>
            </div>
          </form>

          <div className={styles.linkRow}>
            Déjà un compte ?{' '}
            <button className={styles.link} onClick={() => navigate('/login')}>
              Se connecter
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Register
