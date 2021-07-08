import React from 'react';
import { Target } from 'react-feather';
import { Link } from 'taalswap-uikit';
import { useTranslation } from '../../contexts/Localization';

const frontendBaseUrl =
  process.env.REACT_APP_FRONTEND || 'http://localhost:3001';
const interfaceBaseUrl =
  process.env.REACT_APP_INTERFACE || 'http://localhost:3000';

const Search = () => {
  const [showResults, setShowResults] = React.useState(false);
  const onClick = () => setShowResults(true);
  return (
    <div>
      <input type="button" onClick={onClick} className="mobilenav_icon" />
      {showResults ? <Results /> : null}
    </div>
  );
};

const Results = () => {
  const { t } = useTranslation();
  return (
    <div className="hide_menu" id="results">
      <span className="arrow_box">-</span>
      <ul>
        <li>
          <Link href="/" style={{ color: '#00ab55', textDecoration: 'none' }}>
            <span className="home_icon">home_icon</span>Home
          </Link>
        </li>
        <li>
          <Link
            href={`${interfaceBaseUrl}/#/swap`}
            style={{ textDecoration: 'none' }}
          >
            <span className="swap_icon">swap_icon</span>Swap
          </Link>
        </li>
        <li>
          <Link
            href={`${interfaceBaseUrl}/#/liquidity`}
            style={{ textDecoration: 'none' }}
          >
            <span className="liquidity_icon">liquidity_icon</span>Liquidity
          </Link>
        </li>
        <li>
          <Link
            href={`${frontendBaseUrl}/farms`}
            style={{ textDecoration: 'none' }}
          >
            <span className="farms_icon">Farms_icon</span>Farms
          </Link>
        </li>
        <li>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="connect_icon">connect_icon</span>
            {t('Connect Wallet')}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Search;
