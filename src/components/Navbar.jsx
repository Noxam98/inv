import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import { useAuthStore, selectIsAuthed } from '../store/authStore';

const LOGO_URL = '/logo.svg';

const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'INVEST', href: '/invest' },
  { label: 'ABOUT US', href: '/about-us' },
  { label: 'CHAT', href: '/chat' },
  { label: 'BLOG', href: '/blog' },
  { label: 'PROFILE', href: '/profile' },
];

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  background: rgba(68, 4, 98, 0.26);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 14px 20px;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  img {
    height: 44px;
    width: auto;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 1.5px;
  color: ${({ theme }) => theme.colors.gray};
  text-transform: uppercase;
  transition: color 0.2s;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.colors.accentLight};
    transform: scaleX(0);
    transition: transform 0.2s;
    transform-origin: left;
  }

  &:hover, &.active {
    color: ${({ theme }) => theme.colors.white};
    &::after { transform: scaleX(1); }
  }
`;

const Hamburger = styled.button`
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 4px;

  span {
    display: block;
    width: 24px;
    height: 2px;
    background: ${({ theme }) => theme.colors.white};
    transition: all 0.3s;
    transform-origin: center;
  }

  ${({ $open }) => $open && `
    span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    span:nth-child(2) { opacity: 0; }
    span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  `}

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 61px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(7, 1, 15, 0.97);
  z-index: 99;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;

  ${({ $open }) => $open && `display: flex;`}

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none !important;
  }
`;

const MobileNavLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 28px;
  font-weight: 500;
  letter-spacing: 3px;
  color: ${({ theme }) => theme.colors.gray};
  text-transform: uppercase;
  transition: color 0.2s;

  &:hover, &.active { color: ${({ theme }) => theme.colors.white}; }
`;

export default function Navbar() {
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useAppStore();
  const isAuthed = useAuthStore(selectIsAuthed);
  const location = useLocation();

  const getLinkProps = (href) => {
    if ((href === '/chat' || href === '/profile') && !isAuthed) {
      return {
        to: '/signin',
        state: { from: href }
      };
    }
    return {
      to: href
    };
  };

  const isActivePath = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <Nav>
        <LogoLink to="/">
          <img src={LOGO_URL} alt="INDS Logo" />
        </LogoLink>
        <NavLinks>
          {navLinks.map(({ label, href }) => {
            const linkProps = getLinkProps(href);
            const active = isActivePath(href);
            return (
              <li key={label}>
                <NavLink
                  {...linkProps}
                  className={active ? 'active' : ''}
                >
                  {label}
                </NavLink>
              </li>
            );
          })}
        </NavLinks>
        <Hamburger $open={mobileMenuOpen} onClick={toggleMobileMenu} aria-label="Menu">
          <span /><span /><span />
        </Hamburger>
      </Nav>

      <MobileMenu $open={mobileMenuOpen}>
        {navLinks.map(({ label, href }) => {
          const linkProps = getLinkProps(href);
          const active = isActivePath(href);
          return (
            <MobileNavLink
              key={label}
              {...linkProps}
              className={active ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              {label}
            </MobileNavLink>
          );
        })}
      </MobileMenu>
    </>
  );
}


