import type { ButtonHTMLAttributes, HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
import { getApprovedAsset, type ArtAssetId } from '../assets/assetRegistry';
import '../theme/semantropic-pop.tokens.css';
import './visual-primitives.css';

type ActionTone = 'blue' | 'coral' | 'gold' | 'violet';

/** Estructura responsive, SIN integrar a src/App.tsx hasta B02-C2. */
export function GameFrame({ children, className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={'st-theme st-frame ' + className} {...rest}>{children}</div>;
}

interface GamePanelProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  children: ReactNode;
}
export function GamePanel({ title, children, className = '', ...rest }: GamePanelProps) {
  return <section className={'st-panel ' + className} aria-label={title} {...rest}>
    {title ? <h2 className="st-panel__heading">{title}</h2> : null}
    {children}
  </section>;
}

interface ActionTileProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'title'> {
  label: string;
  description?: string;
  symbol?: ReactNode;
  tone?: ActionTone;
}
/** Sin onClick está deshabilitado: nunca simula modos jugables. */
export function ActionTile({ label, description, symbol, tone = 'blue', className = '', onClick, disabled, ...rest }: ActionTileProps) {
  return <button
    type="button"
    className={'st-action st-action--' + tone + ' ' + className}
    onClick={onClick}
    disabled={disabled || !onClick}
    {...rest}
  >
    {symbol ? <span className="st-action__symbol" aria-hidden="true">{symbol}</span> : null}
    <span className="st-action__label">{label}</span>
    {description ? <span className="st-action__description">{description}</span> : null}
  </button>;
}

interface StatusChipProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  symbol?: ReactNode;
}
/** Solo presentación de datos proporcionados; sin cifras ficticias por defecto. */
export function StatusChip({ label, value, symbol, className = '', ...rest }: StatusChipProps) {
  return <div className={'st-chip ' + className} aria-label={label + ': ' + String(value)} {...rest}>
    {symbol ? <span className="st-chip__symbol" aria-hidden="true">{symbol}</span> : null}
    <span className="st-chip__value">{value}</span>
  </div>;
}

interface ArtworkLayerProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  assetId: ArtAssetId;
}
/** No genera <img> con src roto o ficticio; solo habilitar tras aprobar cada recurso. */
export function ArtworkLayer({ assetId, alt = '', className = '', ...rest }: ArtworkLayerProps) {
  const src = getApprovedAsset(assetId);
  if (!src) return null;
  return <img className={'st-art ' + className} src={src} alt={alt} loading="lazy" decoding="async" {...rest} />;
}
