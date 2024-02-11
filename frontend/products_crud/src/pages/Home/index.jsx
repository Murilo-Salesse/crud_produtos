import '../../styles/home.css';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect, useState } from 'react';

import { Modal } from '../../components/Modal';

import { api } from '../../service/api';
import { toast } from 'react-toastify';

import { AiTwotoneDelete } from 'react-icons/ai';
import { HiOutlinePencilAlt } from 'react-icons/hi';

export function Home() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [color, setColor] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  function registerProduct() {
    if (!name || !quantity || !color || !price || !brand) {
      return toast.error('Preencha todos os campos.');
    }

    api
      .post('/', { name, quantity, color, price, brand })
      .then(() => {
        toast.success('Produto cadastrado com sucesso.');

        setName('');
        setQuantity(0);
        setColor('');
        setPrice('');
        setBrand('');
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Não foi possivel cadastrar o produto.');
        }
      });
  }

  async function deleteProduct(id) {
    const confirm = window.confirm('Deseja realmente excluir o produto?');

    if (confirm) {
      await api.delete(`/${id}`);

      toast.info('Produto deletado.');
    }
  }

  function formatPrice(value) {
    if (!value || typeof value !== 'string') {
      return '';
    }

    let numericValue = value.replace(/[^\d]/g, ''); // Remove todos os caracteres não numéricos
    numericValue = numericValue.replace(/^0+/, ''); // Remove zeros à esquerda

    const length = numericValue.length;

    if (length <= 2) {
      return `0.${numericValue.padStart(2, '0')}`;
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

  useEffect(() => {
    async function showProducts() {
      const response = await api.get('/');
      setProducts(response.data);
    }
    showProducts();
  }, [products]);

  return (
    <div>
      <div className="main">
        <Modal isOpen={open} setOpen={setOpen} productId={selectedProductId} />
        <h1>Tabela de Produtos</h1>
        <div className="wrapper-register">
          <div className="wrapper-inputs">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="wrapper-inputs">
            <label htmlFor="quantity">Quantidade</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="wrapper-inputs">
            <label htmlFor="color">Cor</label>
            <input
              type="text"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="wrapper-inputs">
            <label htmlFor="price">Preço</label>
            <input
              type="text"
              id="price"
              value={price}
              onChange={handleInputPrice}
            />
          </div>

          <div className="wrapper-inputs">
            <label htmlFor="brand">Marca</label>
            <input
              type="text"
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div>
            <button onClick={registerProduct}>Cadastrar Produto</button>
          </div>
        </div>
      </div>

      <div className="wrapper-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Quantidade</th>
              <th>Cor</th>
              <th>Preço</th>
              <th>Marca</th>
              <th>Operações</th>
            </tr>
          </thead>

          <tbody>
            {products &&
              products.map((product) => (
                <tr key={String(product.id)}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.color}</td>
                  <td>{product.price}</td>
                  <td>{product.brand}</td>
                  <td className="icons">
                    <div>
                      <HiOutlinePencilAlt
                        onClick={() => {
                          setOpen(!open);
                          setSelectedProductId(product.id);
                        }}
                      />
                    </div>
                    <div>
                      <AiTwotoneDelete
                        onClick={() => deleteProduct(product.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
