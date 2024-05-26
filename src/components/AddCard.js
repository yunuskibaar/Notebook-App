import React, { useState, useEffect } from 'react';
import '../styles/AddCard.css';
import SearchBar from './Search';

// Bileşenin ana fonksiyonu
const AddCard = () => {
  // Durum ve olaylar için useState hook'ları
  const [showAddPopup, setShowAddPopup] = useState(false); // Not ekleme popup'ının görünürlüğünü kontrol eder
  const [showDetailPopup, setShowDetailPopup] = useState(false); // Detay popup'ının görünürlüğünü kontrol eder
  const [title, setTitle] = useState(''); // Başlık durumu
  const [category, setCategory] = useState(''); // Kategori durumu
  const [note, setNote] = useState(''); // Not durumu
  const [warning, setWarning] = useState(false); // Uyarı mesajının görünürlüğünü kontrol eder
  const [selectedCard, setSelectedCard] = useState(null); // Seçilen kartın durumu
  const [cards, setCards] = useState([]); // Kartlar listesinin durumu
  const [searchTerm, setSearchTerm] = useState(''); // Arama teriminin durumu
  const [editedTitle, setEditedTitle] = useState(''); // Düzenlenen başlık durumu
  const [editedCategory, setEditedCategory] = useState(''); // Düzenlenen kategori durumu
  const [editedNote, setEditedNote] = useState(''); // Düzenlenen not durumu

  const categories = ["Alış veriş", "Ders", "Kişisel", "Yemek Tarifleri", "Bağlantılar", "Randevular"]; // Kategoriler listesi
  const categoryClassNames = {
    "Alış veriş": "shopping",
    "Ders": "lesson",
    "Kişisel": "personal",
    "Yemek Tarifleri": "recipes",
    "Bağlantılar": "links",
    "Randevular": "appointments"
  }; // Kategoriye göre sınıf adları

  // Sayfa yüklendiğinde localStorage'dan kartları çek
  useEffect(() => {
    const storedCards = localStorage.getItem('cards');
    if (storedCards) {
      setCards(JSON.parse(storedCards));
    }
  }, []);

  // Kartlar değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  // Not ekleme popup'ını aç/kapat
  const toggleAddPopup = () => {
    setShowAddPopup(!showAddPopup);
    setWarning(false); // Uyarı mesajını sıfırla
  };

  // Detay popup'ını aç/kapat
  const toggleDetailPopup = () => {
    setShowDetailPopup(!showDetailPopup);
  };

  // Başlık değişimini yönetir
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Kategori değişimini yönetir
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Not değişimini yönetir
  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  // Yeni kart eklemeyi yönetir
  const handleSubmit = () => {
    if (!title || !note) {
      setWarning(true); // Başlık veya not boşsa uyarı göster
    } else {
      const newCard = { id: cards.length + 1, title: title, category: category, note: note };
      setCards([...cards, newCard]); // Yeni kartı ekle
      toggleAddPopup(); // Popup'ı kapat
      setTitle(''); // Başlığı sıfırla
      setCategory(''); // Kategoriyi sıfırla
      setNote(''); // Notu sıfırla
    }
  };

  // Kart tıklamasını yönetir
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setEditedTitle(card.title); // Düzenlenen başlığı ayarla
    setEditedCategory(card.category); // Düzenlenen kategoriyi ayarla
    setEditedNote(card.note); // Düzenlenen notu ayarla
    toggleDetailPopup(); // Detay popup'ını aç
  };

  // Kart silmeyi yönetir
  const handleDelete = (id) => {
    const updatedCards = cards.filter(card => card.id !== id);
    setCards(updatedCards); // Kartları güncelle
    toggleDetailPopup(); // Detay popup'ını kapat
  };

  // Aramayı yönetir
  const handleSearch = (term) => {
    if (term.startsWith('@')) {
      const selectedCategory = term.substring(1);
      setCategory(selectedCategory); // Kategoriye göre arama
    } else {
      setCategory(''); // Kategoriyi sıfırla
      setSearchTerm(term); // Arama terimini ayarla
    }
  };

  // Kart güncellemeyi yönetir
  const handleUpdate = () => {
    const updatedCards = cards.map(card => {
      if (card.id === selectedCard.id) {
        return { ...card, title: editedTitle, category: editedCategory, note: editedNote };
      }
      return card;
    });
    setCards(updatedCards); // Kartları güncelle
    toggleDetailPopup(); // Detay popup'ını kapat
  };

  // Kartları filtreler
  const filteredCards = cards.filter(card =>
    (category === '' || card.category === category) &&
    (searchTerm === '' || card.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
   
      <div className='container'>
        {/* Arama bileşeni */}
        <SearchBar onSearch={handleSearch} />
    
        {/* Yeni kart ekleme butonu */}
        <div className="card text-center" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '999', width: "75px", height: "75px" }}>
          <button className='btn btn-default' onClick={toggleAddPopup}>Not Ekle</button>
        </div>
    
        {/* Kartları gösteren container */}
        <div className="card-container">
          {filteredCards.map((card) => (
            /* Kart */
            <div className={`card ${categoryClassNames[card.category]}`} key={card.id} onClick={() => handleCardClick(card)}>
              {/* Kart içeriği */}
              <div className="card-body">
                {/* Kart başlığı */}
                <h5 className="card-title">{card.title}</h5>
                {/* Kart kategorisi */}
                <p className="card-category">{card.category}</p>
                {/* Kart notu */}
                <p className="card-text">{card.note}</p>
              </div>
            </div>
          ))}
        </div>
    
        {/* Yeni kart ekleme popup'ı */}
        {showAddPopup && (
          <div className="add-popup-overlay">
            {/* Popup arkaplanı */}
            <div className="add-popup">
              {/* Kapatma butonu */}
              <button className="close-button" onClick={toggleAddPopup}>
                <span className="close-icon">×</span>
              </button>
              {/* Başlık giriş alanı */}
              <input
                type="text"
                placeholder="Başlık giriniz"
                value={title}
                onChange={handleTitleChange}
                className="form-control mb-2"
              />
              {/* Kategori seçme alanı */}
              <select
                value={category}
                onChange={handleCategoryChange}
                className='form-control mb-2'
              >
                {/* Varsayılan seçenek */}
                <option value="">Kategori seçiniz</option>
                {/* Kategori seçenekleri */}
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
              {/* Not giriş alanı */}
              <textarea
                className='form-control mb-2'
                placeholder="Notunuzu buraya yazınız"
                value={note}
                onChange={handleNoteChange}
              ></textarea>
              {/* Uyarı mesajı */}
              {warning && <p className="warning">Lütfen başlık ve not alanlarını doldurunuz!</p>}
              {/* Kaydetme butonu */}
              <button className='btn btn-primary' onClick={handleSubmit}>Kaydet</button>
            </div>
          </div>
        )}
    
        {/* Kart detay popup'ı */}
        {showDetailPopup && selectedCard && (
          <div className="detail-popup-overlay">
            {/* Popup arkaplanı */}
            <div className="detail-popup">
              {/* Kapatma butonu */}
              <button className="close-button" onClick={toggleDetailPopup}>
                <span className="close-icon">×</span>
              </button>
              {/* Detay içeriği */}
              <div className="detail-popup-content">
                {/* Başlık düzenleme input'u */}
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className='form-control mb-2'
                />
                {/* Kategori düzenleme select'i */}
                <select
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  className='form-control mb-2'
                >
                  {/* Kategori seçenekleri */}
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
                {/* Not düzenleme alanı */}
                <textarea
                  className='form-control mb-2'
                  value={editedNote}
                  onChange={(e) => setEditedNote(e.target.value)}
                ></textarea>
              </div>
              {/* Popup footer */}
              <div className='detail-popup-footer'>
                {/* Güncelleme butonu */}
                <button className='btn btn-primary' onClick={handleUpdate}>Güncelle</button>
                {/* Silme butonu */}
                <button
                  type='button'
                  className='btn btn-danger'
                  onClick={() => handleDelete(selectedCard.id)}
                >
                  Notu Sil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
    
}

export default AddCard;

