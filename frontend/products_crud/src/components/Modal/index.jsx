import '../../styles/modal.css';

import { MdClose } from 'react-icons/md';
import { useState } from 'react';

import { api } from '../../service/api';
import { toast } from 'react-toastify';

export function Modal({ isOpen, setOpen, productId }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [color, setColor] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');

  function formatPrice(value) {
    if (!value || typeof value !== 'string') {
      return '';
    }

    let numericValue = value.replace(/[^\d]/g, '');
    numericValue = numericValue.replace(/^0+/, '');

    const length = numericValue.length;

    if (length === 1) {
      return `0.0${numericValue}`;
    } else if (length === 2) {
      return `0.${numericValue}`;
    } else {
      const integerPart = numericValue.slice(0, length - 2);
      const decimalPart = numericValue.slice(length - 2);
      return `${integerPart}.${decimalPart}`;
    }
  }

  function handleInputPrice(e) {
    const { value } = e.target;
    setPrice(formatPrice(value));
  }

  async function updateProduct(productId) {
    if (!name || !quantity || !color || !price || !brand) {
      return toast.error('Preencha todos os campos.');
    }

    try {
      await api.put(`/${productId}`, {
        name,
        quantity,
        color,
        price,
        brand,
      });

      setName('');
      setQuantity(0);
      setColor('');
      setPrice('');
      setBrand('');

      toast.success('Produto atualizado com sucesso.');
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Não foi possível atualizar o produto.');
      }
    }
  }

  if (isOpen) {
    return (
      <div className="wrapper-modal">
        <div className="wrapper-register-modal">
          <div>
            <MdClose onClick={() => setOpen(!isOpen)} />
          </div>
          <div className="wrapper-inputs-modal">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="wrapper-inputs-modal">
            <label htmlFor="quantity">Quantidade</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="wrapper-inputs-modal">
            <label htmlFor="color">Cor</label>
            <input
              type="text"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="wrapper-inputs-modal">
            <label htmlFor="price">Preço</label>
            <input
              type="text"
              id="price"
              value={price}
              onChange={handleInputPrice}
            />
          </div>

          <div className="wrapper-inputs-modal">
            <label htmlFor="brand">Marca</label>
            <input
              type="text"
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div>
            <button onClick={() => updateProduct(productId)}>
              Atualizar Produto
            </button>
          </div>
        </div>
      </div>
    );
  }
}
