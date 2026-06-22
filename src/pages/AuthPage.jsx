import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';

import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { registerAnonymous, signInWithCode } from '../lib/supabase';

const SCRAMBLE_CHARS = '!@#$%&*+=?ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

const drift = keyframes`
  0%   { transform: translate3d(-12%, -8%, 0) scale(1); }
  33%  { transform: translate3d(8%, 6%, 0) scale(1.15); }
  66%  { transform: translate3d(-4%, 12%, 0) scale(0.95); }
  100% { transform: translate3d(-12%, -8%, 0) scale(1); }
`;

const driftAlt = keyframes`
  0%   { transform: translate3d(10%, 14%, 0) scale(1.1); }
  50%  { transform: translate3d(-8%, -6%, 0) scale(0.9); }
  100% { transform: translate3d(10%, 14%, 0) scale(1.1); }
`;

const pulseRing = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(199, 125, 255, 0.45); }
  70%  { box-shadow: 0 0 0 18px rgba(199, 125, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(199, 125, 255, 0); }
`;

const Page = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 40px 80px;
  overflow: hidden;
  isolation: isolate;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 100px 20px 60px;
  }
`;

const Orb = styled.div`
  position: absolute;
  width: 60vmax;
  height: 60vmax;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.55;
  z-index: -1;
  pointer-events: none;
  will-change: transform;

  &.violet {
    left: -20vmax;
    top: -10vmax;
    background: radial-gradient(circle, #581385 0%, rgba(88, 19, 133, 0) 60%);
    animation: ${drift} 24s ease-in-out infinite;
  }

  &.magenta {
    right: -25vmax;
    bottom: -20vmax;
    background: radial-gradient(circle, #ff2ea8 0%, rgba(255, 46, 168, 0) 60%);
    animation: ${driftAlt} 32s ease-in-out infinite;
    opacity: 0.35;
  }

  &.cyan {
    left: 30%;
    top: 60%;
    width: 30vmax;
    height: 30vmax;
    background: radial-gradient(circle, #2ee8ff 0%, rgba(46, 232, 255, 0) 60%);
    animation: ${drift} 28s ease-in-out infinite reverse;
    opacity: 0.18;
  }
`;

const Grain = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.08;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
`;

const Shell = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  background: linear-gradient(135deg, rgba(15, 5, 28, 0.7) 0%, rgba(20, 8, 36, 0.55) 100%);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 28px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow:
    0 60px 120px -40px rgba(155, 93, 229, 0.35),
    0 0 0 1px rgba(199, 125, 255, 0.05) inset;
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 36px 24px;
    border-radius: 20px;
  }
`;

const Pane = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 380px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: 0;
  }
`;

const SwitchRow = styled.div`
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
  margin-top: 24px;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.02em;
  line-height: 1.6;
`;

const SwitchLink = styled(Link)`
  color: ${({ theme }) => theme.colors.accentLight};
  text-decoration: none;
  font-weight: 500;
  margin-left: 6px;
  border-bottom: 1px dashed rgba(199, 125, 255, 0.4);
  transition: border-color 0.15s, color 0.15s;

  &:hover {
    border-bottom-style: solid;
    color: ${({ theme }) => theme.colors.white};
    border-bottom-color: ${({ theme }) => theme.colors.white};
  }
`;


const Eyebrow = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  opacity: 0.7;
  margin-bottom: 18px;

  & > span {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accentLight};
    margin-right: 10px;
    vertical-align: middle;
    animation: ${pulseRing} 2s ease-out infinite;
  }
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(38px, 5vw, 64px);
  font-weight: 500;
  line-height: 0.96;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 14px;

  em {
    font-style: normal;
    background: linear-gradient(90deg, #c77dff 0%, #ff7bd9 60%, #ffc56b 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Lede = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.gray};
  margin-bottom: 32px;
  max-width: 38ch;
`;

const InputWrap = styled.div`
  position: relative;
  margin-bottom: 18px;
`;

const Input = styled.input`
  width: 100%;
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.white};
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 18px 20px;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  caret-color: ${({ theme }) => theme.colors.accentLight};

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }

  &:focus {
    outline: none;
    border-color: rgba(199, 125, 255, 0.55);
    background: rgba(0, 0, 0, 0.55);
    box-shadow: 0 0 0 4px rgba(199, 125, 255, 0.08);
  }
`;

const InputHint = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.2);
  pointer-events: none;
`;

const CheckRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
  margin-bottom: 24px;
  cursor: pointer;
  user-select: none;
  line-height: 1.5;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 18px;
  height: 18px;
  margin: 2px 0 0;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  transition: border-color 0.15s, background 0.15s;

  &:checked {
    background: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accentLight};
  }

  &:checked::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

const AnchorLink = styled.a`
  color: ${({ theme }) => theme.colors.accentLight};
  text-decoration: none;
  border-bottom: 1px dashed rgba(199, 125, 255, 0.4);

  &:hover {
    border-bottom-style: solid;
  }
`;


const primaryButton = css`
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 16px 24px;
  border-radius: 12px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #fff;
  background: linear-gradient(135deg, #9b5de5 0%, #581385 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 12px rgba(155, 93, 229, 0.2);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #c77dff 0%, #9b5de5 100%);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.35s ease;
  }

  &:hover:not(:disabled) {
    border-color: rgba(255, 255, 255, 0.35);
    box-shadow: 
      0 12px 28px -8px rgba(155, 93, 229, 0.45),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    transform: translateY(-2px);
  }

  &:hover:not(:disabled)::before {
    opacity: 1;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(155, 93, 229, 0.2);
  }

  &:disabled {
    opacity: 0.35;
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.3);
    box-shadow: none;
    cursor: not-allowed;
  }
`;

const Button = styled(motion.button)`
  ${primaryButton}
`;

const GhostButton = styled(motion.button)`
  position: relative;
  width: 100%;
  padding: 16px 24px;
  border-radius: 12px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(199, 125, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover:not(:disabled) {
    background: rgba(199, 125, 255, 0.06);
    border-color: ${({ theme }) => theme.colors.accentLight};
    color: ${({ theme }) => theme.colors.white};
    box-shadow: 0 8px 20px -6px rgba(199, 125, 255, 0.25);
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.35;
    background: rgba(255, 255, 255, 0.01);
    border-color: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.2);
    box-shadow: none;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled(motion.div)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #ff6b9d;
  margin-top: 14px;
  letter-spacing: 0.02em;
`;

const RegisterPitch = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 28px;

  & h2 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: clamp(20px, 2vw, 26px);
    font-weight: 400;
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.white};
  }

  & p {
    font-size: 14px;
    line-height: 1.55;
    color: ${({ theme }) => theme.colors.gray};
    max-width: 34ch;
  }
`;

const Pills = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
`;

const Pill = styled.li`
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
`;

const CodeBox = styled.div`
  position: relative;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  letter-spacing: 0.05em;
  color: #fff;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(199, 125, 255, 0.35);
  border-radius: 14px;
  padding: 20px 56px 20px 20px;
  word-break: break-all;
  line-height: 1.45;
  margin-bottom: 16px;
  box-shadow: 0 0 0 4px rgba(199, 125, 255, 0.06);

  & .handle {
    color: ${({ theme }) => theme.colors.accentLight};
  }

  & .dot {
    color: rgba(255, 255, 255, 0.35);
  }
`;

const CopyBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  background: rgba(199, 125, 255, 0.1);
  border: 1px solid rgba(199, 125, 255, 0.25);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(199, 125, 255, 0.2);
  }
`;

const Warn = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  line-height: 1.55;
  color: rgba(255, 200, 100, 0.85);
  background: rgba(255, 170, 60, 0.04);
  border-left: 2px solid rgba(255, 170, 60, 0.4);
  padding: 12px 14px;
  margin-bottom: 20px;
  border-radius: 0 8px 8px 0;
`;

function useTypewriter(samples, { active = true } = {}) {
  const [text, setText] = useState('');
  const ref = useRef({ i: 0, char: 0, dir: 1, t: 0 });

  useEffect(() => {
    if (!active) return undefined;
    let raf;
    const tick = (now) => {
      const s = ref.current;
      if (now - s.t > (s.dir > 0 ? 70 : 35)) {
        s.t = now;
        const current = samples[s.i % samples.length];
        s.char += s.dir;
        if (s.char > current.length) {
          s.char = current.length;
          s.dir = -1;
          s.t = now + 1200;
        } else if (s.char < 0) {
          s.char = 0;
          s.dir = 1;
          s.i += 1;
        }
        setText(current.slice(0, s.char));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [samples, active]);

  return text;
}

function ScrambleText({ value, duration = 1100 }) {
  const [out, setOut] = useState('');

  useEffect(() => {
    if (!value) {
      return undefined;
    }
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const lockUntil = Math.floor(t * value.length);
      let next = '';
      for (let i = 0; i < value.length; i += 1) {
        if (i < lockUntil || value[i] === '.') {
          next += value[i];
        } else {
          next += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      setOut(next);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setOut(value);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{value ? out : ''}</>;
}


const PLACEHOLDER_SAMPLES = [
  'usr_a7k9m2p3.b8FwQ2x9...',
  'usr_2mq8nzpr.aR4xZ9pL...',
  'adm_3yagb5ya.u3agzz...',
];

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);
  const setUser = useAuthStore((s) => s.setUser);
  const redirectTo = location.state?.from || '/';

  const [code, setCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [regAgreed, setRegAgreed] = useState(false);
  const [loginErr, setLoginErr] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [issued, setIssued] = useState(null);
  const [issuedErr, setIssuedErr] = useState(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);

  const inputFocused = code.length > 0;
  const placeholder = useTypewriter(PLACEHOLDER_SAMPLES, { active: !inputFocused });

  useEffect(() => {
    if (ready && user) navigate(redirectTo, { replace: true });
  }, [ready, user, navigate, redirectTo]);

  const canSubmit = useMemo(() => agreed && code.trim().length > 12 && !loggingIn, [agreed, code, loggingIn]);

  const onLogin = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoggingIn(true);
    setLoginErr(null);
    const { data, error } = await signInWithCode(code);
    if (error) {
      setLoginErr(error.message || 'Authentication failed');
      setLoggingIn(false);
      return;
    }
    setUser(data.user);
  };

  const onGenerate = async () => {
    setGenerating(true);
    setIssuedErr(null);
    const { data, error } = await registerAnonymous();
    setGenerating(false);
    if (error) {
      setIssuedErr(error.message);
      return;
    }
    setIssued(data);
  };

  const onCopy = async () => {
    if (!issued) return;
    try {
      await navigator.clipboard.writeText(issued.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard might be blocked; user can still copy manually
    }
  };

  const onContinue = async () => {
    if (!issued || !saved) return;
    setAutoLoading(true);
    // The register endpoint already issued a session cookie. We have the user
    // shape from the issued payload — just push it into the store and the
    // ready/user effect handles the redirect.
    if (issued.user) {
      setUser(issued.user);
      return;
    }
    const { data, error } = await signInWithCode(issued.code);
    if (error) {
      setIssuedErr(error.message || 'Sign-in failed');
      setAutoLoading(false);
      return;
    }
    setUser(data.user);
  };

  const isSignUp = location.pathname === '/signup';

  return (
    <Page>
      <Orb className="violet" />
      <Orb className="magenta" />
      <Orb className="cyan" />
      <Grain />

      <Shell
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <AnimatePresence mode="wait">
          {!isSignUp ? (
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
            >
              <Pane className="login" as="form" onSubmit={onLogin}>
                <Eyebrow>
                  <span />
                  Returning · Sign in
                </Eyebrow>
                <Title>
                  Welcome <em>back</em>.
                </Title>
                <Lede>
                  Paste your code to enter. It’s the only key — there’s no recovery flow by design.
                </Lede>

                <InputWrap>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={placeholder || 'paste your code'}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <InputHint>code</InputHint>
                </InputWrap>

                <CheckRow>
                  <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                  <span>
                    I accept the <AnchorLink href="#" onClick={(e) => e.preventDefault()}>responsibility agreement</AnchorLink> — if I lose the code, I lose access. No support recovery.
                  </span>
                </CheckRow>

                <Button
                  type="submit"
                  disabled={!canSubmit}
                  whileTap={{ scale: 0.98 }}
                >
                  {loggingIn ? 'Authenticating…' : 'Authenticate'}
                </Button>

                <AnimatePresence>
                  {loginErr && (
                    <ErrorMsg
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      ✗ {loginErr}
                    </ErrorMsg>
                  )}
                </AnimatePresence>

                <SwitchRow>
                  New here? <SwitchLink to="/signup" state={location.state}>Generate a code</SwitchLink>
                </SwitchRow>
              </Pane>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
            >
              <Pane className="register">
                {!issued ? (
                  <>
                    <Eyebrow>
                      <span />
                      New here · Generate
                    </Eyebrow>
                    <RegisterPitch>
                      <h2>No email. No name. No trace.</h2>
                      <p>
                        Get a single one-shot code. Save it once — it is your identity for every future session.
                      </p>
                    </RegisterPitch>
                    <Pills>
                      <Pill>anonymous</Pill>
                      <Pill>20-char key</Pill>
                      <Pill>no recovery</Pill>
                    </Pills>

                    <CheckRow>
                      <Checkbox checked={regAgreed} onChange={(e) => setRegAgreed(e.target.checked)} />
                      <span>
                        I accept the <AnchorLink href="#" onClick={(e) => e.preventDefault()}>responsibility agreement</AnchorLink> — if I lose the code, I lose access. No support recovery.
                      </span>
                    </CheckRow>

                    <GhostButton
                      type="button"
                      onClick={onGenerate}
                      disabled={generating || !regAgreed}
                      whileTap={{ scale: 0.98 }}
                    >
                      {generating ? 'Generating…' : 'Take your code'}
                    </GhostButton>

                    <AnimatePresence>
                      {issuedErr && (
                        <ErrorMsg
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          ✗ {issuedErr}
                        </ErrorMsg>
                      )}
                    </AnimatePresence>

                    <SwitchRow>
                      Already have a code? <SwitchLink to="/signin" state={location.state}>Sign in</SwitchLink>
                    </SwitchRow>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Eyebrow>
                      <span />
                      Your code · One-time view
                    </Eyebrow>
                    <RegisterPitch>
                      <h2>Save this. Now.</h2>
                    </RegisterPitch>

                    <CodeBox>
                      <ScrambleText value={issued.code} />
                      <CopyBtn type="button" onClick={onCopy}>
                        {copied ? '✓ Copied' : 'Copy'}
                      </CopyBtn>
                    </CodeBox>

                    <Warn>
                      If you close this page without saving, the code is gone. There is no admin recovery.
                    </Warn>

                    <CheckRow>
                      <Checkbox checked={saved} onChange={(e) => setSaved(e.target.checked)} />
                      <span>I saved the code. I take full responsibility for keeping it.</span>
                    </CheckRow>

                    <Button
                      type="button"
                      disabled={!saved || autoLoading}
                      onClick={onContinue}
                      whileTap={{ scale: 0.98 }}
                    >
                      {autoLoading ? 'Signing in…' : 'Sign in'}
                    </Button>
                  </motion.div>
                )}
              </Pane>
            </motion.div>
          )}
        </AnimatePresence>
      </Shell>
    </Page>
  );
}
