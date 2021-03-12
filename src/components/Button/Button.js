import PropTypes from 'prop-types';
import s from './Button.module.css';

export default function Button({ onClick, page }) {
  const loading = () => {
    onClick(page);
  };

  return (
    <button className={s.button} type="button" onClick={loading}>
      Load more
    </button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
};
