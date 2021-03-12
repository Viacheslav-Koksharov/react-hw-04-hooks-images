import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import s from './ImageGallery.module.css';
import fetchImg from '../../services/fetch';
import { toast } from 'react-toastify';
import Spinner from '../Loader/Loader';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';

export default function ImageGallery({ searchQuery, page }) {
  const [currentPage, setCurrentPage] = useState(page);
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('idle');
  const [largeImageURL, setLargeImageURL] = useState(null);
  const [tags, setTags] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setStatus('pending');

    if (searchQuery.trim() !== '') {
      fetchImg(searchQuery, page)
        .then(items => {
          if (items.length === 0) {
            setStatus('rejected');
            toast.error('Идите в жопу с таким запросом', {
              className: `${s.toastify}`,
            });
            return;
          }
          setImages(items);
          setCurrentPage(page + 1);
          setStatus('resolved');
        })
        .catch(errorMessage);
    } else {
      setStatus('idle');
    }
  }, [searchQuery, page]);

  const onClick = () => {
    fetchImg(searchQuery, currentPage)
      .then(items => {
        setImages([...images, ...items]);
        setCurrentPage(currentPage + 1);
        setStatus('resolved');
        scrollTo();
      })
      .catch(errorMessage);
  };

  const errorMessage = error => {
    setStatus('rejected');
    toast.error(error.message);
  };

  const scrollTo = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const selectedImage = e => {
    if (e.target.nodeName === 'IMG') {
      const selectedImage = images.find(
        image => image.id === Number(e.target.id),
      );
      setShowModal(!showModal);
      setLargeImageURL(selectedImage.largeImageURL);
      setTags(selectedImage.tags);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    setLargeImageURL(null);
    setTags(null);
  };

  if (status === 'idle' || status === 'rejected') return null;
  if (status === 'pending') return <Spinner />;
  if (status === 'resolved' && images.length > 0) {
    return (
      <>
        <ul className={s.imageGallery} onClick={selectedImage}>
          {images.map(({ id, webformatURL, tags }) => (
            <ImageGalleryItem
              key={id}
              id={id}
              webformatURL={webformatURL}
              tags={tags}
            />
          ))}
        </ul>
        {<Button page={page} onClick={onClick} />}
        {showModal && (
          <Modal onClose={toggleModal}>
            <img src={largeImageURL} alt={tags} />
          </Modal>
        )}
      </>
    );
  }
}

ImageGallery.propTypes = {
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
};
