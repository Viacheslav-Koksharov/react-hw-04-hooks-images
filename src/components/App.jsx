import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const page = 1;

  return (
    <>
      <Searchbar onSubmit={setSearchQuery} />
      <ImageGallery searchQuery={searchQuery} page={page} />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick="true"
      />
    </>
  );
}
