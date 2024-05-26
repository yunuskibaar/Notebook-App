import React, { useState } from 'react';
import '../styles/Search.css';

// Arama bileşeni
const SearchBar = ({ onSearch }) => {
  // Arama terimi ve dropdown'un durumu için state'ler
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Arama işlemini yöneten fonksiyon
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    // Eğer terim '@' içermiyorsa, normal arama yap
    if (!term.includes('@')) {
      onSearch(term);
      setShowDropdown(false);
    } else {
      // Eğer terim '@' içeriyorsa, kategori seçim dropdown'unu göster
      setShowDropdown(true);
    }
  }

  // Kategori seçimine göre arama yapan fonksiyon
  const handleCategorySelect = (category) => {
    const term = `@${category}`;
    setSearchTerm(term);
    onSearch(term);
    setShowDropdown(false);
  }

  // Kategori listesi
  const categories = ["Alış veriş", "Ders", "Kişisel", "Yemek Tarifleri", "Bağlantılar", "Randevular"];

  return (
    <div className="search-container">
      {/* Uygulama başlığı */}
      <div className='title'>Not Defteri Uygulaması</div>
      {/* Arama input'u */}
      <input
        type="text"
        placeholder="Not ya da @kategori ara"
        className="search-input"
        value={searchTerm}
        onChange={handleSearch}
      />
      {/* Kategori seçim dropdown'u */}
      {showDropdown && (
        <div className="dropdown">
          {categories.map((category, index) => (
            <div key={index} onClick={() => handleCategorySelect(category)}>
              {category}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
