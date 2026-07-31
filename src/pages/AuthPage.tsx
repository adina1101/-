import { useState, type FormEvent } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage('');
    const result = mode === 'signup'
      ? await supabase.auth.signUp({
        email, password,
        options: { data: { nickname }, emailRedirectTo: window.location.origin },
      })
      : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) setMessage(result.error.message);
    else if (mode === 'signup' && !result.data.session) setMessage('Проверь почту и подтверди регистрацию');
  };

  const signInWithGoogle = async () => {
    setBusy(true); setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin, queryParams: { access_type: 'offline', prompt: 'consent' } },
    });
    if (error) { setMessage(error.message); setBusy(false); }
  };

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <div className="auth-logo">C<span>♠</span></div>
        <h1>CARDI<b>X</b></h1><p>Классические карточные игры.<br />Одна вселенная.</p>
        <div className="auth-suits"><span>♥</span><span>♣</span><span>♦</span><span>♠</span></div>
      </section>
      <section className="auth-panel">
        <div className="auth-tabs"><button className={mode === 'signin' ? 'active' : ''} onClick={() => setMode('signin')}>Вход</button><button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Регистрация</button></div>
        <h2>{mode === 'signin' ? 'С возвращением' : 'Создай аккаунт'}</h2>
        <p>{mode === 'signin' ? 'Войди и продолжи свою игру' : 'Начни играть и получать награды'}</p>
        <button className="google-button" disabled={busy || !isSupabaseConfigured} onClick={signInWithGoogle}><span>G</span> Продолжить с Google</button>
        <div className="auth-divider"><i />или<i /></div>
        <form onSubmit={submit}>
          {mode === 'signup' && <label><span>Ник</span><input value={nickname} onChange={(event) => setNickname(event.target.value)} minLength={2} maxLength={18} placeholder="Твоё имя в CARDIX" required /></label>}
          <label><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label>
          <label><span>Пароль</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} placeholder="Минимум 6 символов" required /></label>
          <button className="auth-submit" disabled={busy || !isSupabaseConfigured}>{busy ? 'Подождите…' : mode === 'signin' ? 'Войти' : 'Создать аккаунт'}</button>
        </form>
        {!isSupabaseConfigured && <p className="auth-message">Добавь настройки Supabase в файл .env</p>}
        {message && <p className="auth-message">{message}</p>}
        <small>Продолжая, ты принимаешь правила CARDIX и политику конфиденциальности.</small>
      </section>
    </main>
  );
}
