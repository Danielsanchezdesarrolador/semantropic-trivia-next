import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import './access-portal.css';
import LobbyTransitionOptionC from './LobbyTransitionOptionC';

const routes = ['', 'welcome', 'sign-in', 'register', 'verify', 'forgot-password', 'reset-password', 'auth-status', 'lobby-transition'] as const;
type AccessRoute = typeof routes[number];
export const isAccessRoute = (route: string): route is AccessRoute => routes.includes(route as AccessRoute);
const logo = '/assets/home/brand/semantropic-trivia-logo-v1.png';
const titles: Record<string, [string, string]> = {
  'sign-in': ['Iniciar sesión', 'Continúa tu aventura de conocimiento.'],
  register: ['Crear cuenta', 'Únete a nuestra comunidad.'],
  verify: ['Verifica tu cuenta', 'Así se verá la verificación por correo.'],
  'forgot-password': ['Recuperar contraseña', 'Te ayudaremos a volver al juego.'],
  'reset-password': ['Nueva contraseña', 'Elige una contraseña segura.'],
  'auth-status': ['¡Todo listo!', 'Vista previa de la confirmación.'],
  'lobby-transition': ['¡Bienvenido/a!', 'Preparando tu entrada al lobby'],
};
function Link({ to, children, className = '' }: { to: string; children: React.ReactNode; className?: string }) {
  return <a className={className} href={'#' + to}>{children}</a>;
}
function Field({ label, name, password = false, ...props }: { label: string; name: string; password?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  return <div className="b04-field"><label htmlFor={id}>{label}</label><span className="b04-field-row"><input {...props} id={id} name={name} type={password ? (visible ? 'text' : 'password') : props.type || 'text'} required />{password && <button type="button" aria-label={(visible ? 'Ocultar ' : 'Mostrar ') + label.toLowerCase()} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? 'Ocultar' : 'Mostrar'}</button>}</span></div>;
}
function UserIcon({ add = false }: { add?: boolean }) {
  return <svg className="b04-user-icon" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="10" r="8" fill="currentColor"/><path d="M5 36v-6a15 15 0 0 1 30 0v6Z" fill="currentColor"/>{add && <path d="M3 7v12m-6-6H9" stroke="currentColor" strokeWidth="3"/>}</svg>;
}
function Ornament() {
  return <svg className="b04-ornament" viewBox="0 -50 440 290" aria-hidden="true"><path d="M15 170a205 205 0 0 1 410 0" stroke="#6bdbff"/><path d="M30 170a190 190 0 0 1 380 0" stroke="#a568ff"/><path d="M45 170a175 175 0 0 1 350 0" stroke="#ffdb65"/><circle cx="220" cy="160" r="42" fill="#7239cf" stroke="#74e6ff"/><path d="m220 122 32 38-32 38-32-38Z" fill="#75dcff" stroke="white"/><path d="M220 122v76m-32-38h64" stroke="white"/></svg>;
}
export default function AccessPortal({ route }: { route: string }) {
  const welcome = route === '' || route === 'welcome';
  const [message, setMessage] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { setMessage(''); heading.current?.focus(); }, [route]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.has('confirm') && data.get('password') !== data.get('confirm')) { setMessage('Las contraseñas no coinciden.'); return; }
    setMessage('Vista previa: no se han enviado datos ni creado una sesión. Usa los enlaces de recorrido para revisar la siguiente pantalla.');
  }
  if (route === 'lobby-transition') return <LobbyTransitionOptionC />;
  const content = titles[route] || titles['sign-in'];
  return <main className={'b04-access' + (welcome ? ' b04-welcome' : '')}>
    <div className="b04-environment" aria-hidden="true" />
    {!welcome && <header className="b04-top"><Link to="welcome">‹ Volver a bienvenida</Link><span>PORTAL SOCIAL</span></header>}
    {welcome ? <section className="b04-portal" aria-labelledby="welcome-title">
      <svg className="b04-portal-gem" viewBox="0 0 70 90" aria-hidden="true"><path d="m35 2 32 39-32 47L3 41Z" fill="#db72ff" stroke="#ffe2ff" strokeWidth="3"/><path d="m35 2 12 39-12 47-12-47Z" fill="#f9c7ff"/><path d="M3 41h64" stroke="#ffe2ff" strokeWidth="2"/></svg>
      <h1 id="welcome-title" ref={heading} tabIndex={-1}>¡Bienvenido a</h1>
      <img className="b04-logo" src={logo} alt="Semantropic Trivia" width="585" height="370" />
      <p className="b04-tagline">El videojuego social de<br/>preguntas y conocimientos</p>
      <div className="b04-actions"><Link className="b04-cta" to="sign-in"><UserIcon/> INICIAR SESIÓN</Link><Link className="b04-cta b04-coral" to="register"><UserIcon add/> CREAR CUENTA</Link></div>
      <p className="b04-guest">Explorar como invitado <span>Por evaluar</span></p>
      <p className="b04-preview-note">Vista previa visual · acceso a cuentas próximamente</p>
      <Link className="b04-local-link" to="home">Ir al lobby actual · práctica local</Link>
      <img className="b04-crystal b04-crystal-left" src="/assets/home/sheet/crystal-blue.png" alt=""/>
      <img className="b04-crystal b04-crystal-right" src="/assets/home/sheet/crystal-violet.png" alt=""/>
    </section> : <div className="b04-layout">
      <aside className="b04-story"><h2>TU AVENTURA CONTINÚA</h2><p>Vuelve para seguir jugando.</p><Ornament/><h3>SEMANTROPIC POP</h3><p>Fantasía Social</p></aside>
      <section className={'b04-card b04-card--' + route} aria-labelledby="access-title" key={route}>
        <img className="b04-logo" src={logo} alt="Semantropic Trivia" width="585" height="370"/>
        <div className="b04-card-content"><h1 id="access-title" ref={heading} tabIndex={-1}>{content[0]}</h1><p className="b04-subtitle">{content[1]}</p>
          <p className="b04-preview-note">Vista previa · sin cuentas ni envíos reales</p>
          <form onSubmit={submit}>
            {route === 'register' && <Field label="Nombre de usuario" name="displayName" autoComplete="nickname" placeholder="Tu nombre público" maxLength={40}/>}
            {['sign-in', 'register', 'forgot-password'].includes(route) && <Field label="Correo electrónico" name="email" type="email" autoComplete="email" placeholder="jugador@ejemplo.com"/>}
            {['sign-in', 'register', 'reset-password'].includes(route) && <Field label={route === 'reset-password' ? 'Nueva contraseña' : 'Contraseña'} name="password" password autoComplete={route === 'sign-in' ? 'current-password' : 'new-password'} minLength={route === 'sign-in' ? 1 : 8}/>}
            {['register', 'reset-password'].includes(route) && <Field label="Confirmar contraseña" name="confirm" password autoComplete="new-password" minLength={8}/>}
            {route === 'sign-in' && <Link className="b04-forgot" to="forgot-password">¿Olvidaste tu contraseña?</Link>}
            {route === 'register' && <p className="b04-legal">Los términos, la privacidad y el flujo de edad y consentimiento se definirán antes de habilitar el registro.</p>}
            {route === 'verify' && <><div className="b04-mail" aria-hidden="true">✉</div><h2>Revisa tu correo</h2><p>El método de verificación real está pendiente.</p><Field label="Código de seis dígitos · ejemplo visual" name="code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" className="b04-code"/></>}
            {route === 'forgot-password' && <p>Introduce tu correo para revisar el formulario. En esta versión no se enviará ningún enlace.</p>}
            {route === 'reset-password' && <p className="b04-legal">8 caracteres como mínimo. Evita contraseñas reutilizadas. Ambos campos deben coincidir.</p>}
            {route === 'auth-status' && <><div className="b04-success" aria-hidden="true">✓</div><h2>Confirmación de ejemplo</h2><p>Aquí aparecerá la confirmación cuando exista un servicio real. No se ha verificado ninguna cuenta.</p></>}
            {route === 'lobby-transition' && <><Ornament/><p>Recorrido visual completado. Puedes abrir el lobby y su práctica local.</p></>}
            {message && <p className="b04-message" role="status">{message}</p>}
            {!['auth-status', 'lobby-transition'].includes(route) && <button className={'b04-cta' + (route === 'register' ? ' b04-coral' : '')} type="submit">{{'sign-in':'ENTRAR', register:'CREAR CUENTA', verify:'VERIFICAR', 'forgot-password':'ENVIAR ENLACE', 'reset-password':'GUARDAR CONTRASEÑA'}[route]}</button>}
          </form>
          {route === 'sign-in' && <p className="b04-switch">¿Aún no tienes cuenta? <Link to="register">Crear cuenta</Link></p>}
          {route === 'register' && <p className="b04-switch">¿Ya tienes cuenta? <Link to="sign-in">Iniciar sesión</Link></p>}
          {['forgot-password','reset-password'].includes(route) && <Link to="sign-in">Volver a iniciar sesión</Link>}
          {route === 'sign-in' && <details className="b04-states"><summary>Ver estados de interfaz · ejemplos visuales</summary><ul>{[
            ['loading', 'Cargando', 'La operación estará en curso.'],
            ['error', 'Error de acceso', 'No pudimos iniciar sesión. Revisa los datos e inténtalo de nuevo.'],
            ['offline', 'Sin conexión', 'Vuelve a intentar cuando tengas conexión.'],
            ['success', 'Correo confirmado', 'La confirmación requerirá respuesta del servicio real.'],
            ['expired', 'Enlace caducado', 'Solicita un nuevo enlace.'],
            ['attempts', 'Demasiados intentos', 'Prueba de nuevo más tarde.'],
          ].map(([state, title, text]) => <li key={state} className={'b04-state b04-state--' + state}><strong>{title}</strong><span>{text}</span></li>)}</ul></details>}
          <nav className="b04-tour" aria-label="Recorrido visual sin autenticación"><span>Recorrido de pantallas</span>
            {route === 'sign-in' && <Link to="lobby-transition">Ver transición al lobby →</Link>}
            {route === 'register' && <Link to="verify">Ver verificación →</Link>}
            {route === 'verify' && <><button type="button" onClick={() => setMessage('Vista previa: no se ha enviado ningún código.')}>Reenviar código</button><Link to="auth-status">Ver confirmación →</Link></>}
            {route === 'forgot-password' && <Link to="reset-password">Ver nueva contraseña →</Link>}
            {route === 'reset-password' && <Link to="auth-status">Ver confirmación →</Link>}
            {route === 'auth-status' && <Link className="b04-cta" to="lobby-transition">CONTINUAR</Link>}
            {route === 'lobby-transition' && <Link className="b04-cta" to="home">ABRIR LOBBY LOCAL</Link>}
          </nav>
        </div>
      </section>
    </div>}
  </main>;
}
