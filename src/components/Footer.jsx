import styled from 'styled-components';

const EMAIL_ICON = 'https://cdn.prod.website-files.com/692480ace4527d1f718a15fa/692d70dbc4f27a13914a1135_Email%20logo%201%20(1).svg';
const TG_ICON = 'https://cdn.prod.website-files.com/692480ace4527d1f718a15fa/692d70dd9016c01fabcdcdb7_telegram%20logo%201%20(1).svg';
const WA_ICON = 'https://cdn.prod.website-files.com/692480ace4527d1f718a15fa/692d70d9dda4c0abe487a436_whatsup%20logo%201%20(1).svg';
const YT_ICON = 'https://cdn.prod.website-files.com/692480ace4527d1f718a15fa/692d70d56eed2074c7926dde_youtube%20logo%201%20(1).svg';

const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'INVEST', href: '/invest' },
  { label: 'ABOUT US', href: '/about-us' },
  { label: 'CHAT', href: '/chat' },
  { label: 'BLOG', href: '/blog' },
];

const socialLinks = [
  { icon: EMAIL_ICON, href: '#', label: 'Email' },
  { icon: TG_ICON, href: '#', label: 'Telegram' },
  { icon: WA_ICON, href: '#', label: 'WhatsApp' },
  { icon: YT_ICON, href: '#', label: 'YouTube' },
];

const FooterEl = styled.footer`
  background: #030007;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 60px 40px 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 40px 20px 24px;
  }
`;

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 40px;
  align-items: start;
  margin-bottom: 48px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const Brand = styled.div``;

const BrandName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 10px;
`;

const BrandTagline = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
  line-height: 1.6;
  max-width: 240px;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    align-items: flex-start;
  }
`;

const NavLink = styled.a`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.2s;

  &:hover { color: ${({ theme }) => theme.colors.white}; }
`;

const Social = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: flex-start;
  }
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: background 0.2s, border-color 0.2s;

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
    filter: brightness(0) invert(1);
    opacity: 0.7;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceMid};
    border-color: rgba(155, 93, 229, 0.4);
    img { opacity: 1; }
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 24px;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

const Copyright = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.grayDark};
  letter-spacing: 0.5px;
`;

const Legal = styled.div`
  display: flex;
  gap: 24px;
`;

const LegalLink = styled.a`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.grayDark};
  transition: color 0.2s;

  &:hover { color: ${({ theme }) => theme.colors.gray}; }
`;

export default function Footer() {
  return (
    <FooterEl>
      <Inner>
        <Top>
          <Brand>
            <BrandName>INDS</BrandName>
            <BrandTagline>
              Autonomous secure financial system — decentralized, ethical, private.
            </BrandTagline>
          </Brand>
          <Nav>
            {navLinks.map(({ label, href }) => (
              <NavLink key={label} href={href}>{label}</NavLink>
            ))}
          </Nav>
          <Social>
            {socialLinks.map(({ icon, href, label }) => (
              <SocialLink key={label} href={href} aria-label={label}>
                <img src={icon} alt={label} />
              </SocialLink>
            ))}
          </Social>
        </Top>
        <Divider />
        <Bottom>
          <Copyright>© {new Date().getFullYear()} Invite D Security. All rights reserved.</Copyright>
          <Legal>
            <LegalLink href="#">Privacy Policy</LegalLink>
            <LegalLink href="#">Terms of Service</LegalLink>
          </Legal>
        </Bottom>
      </Inner>
    </FooterEl>
  );
}
