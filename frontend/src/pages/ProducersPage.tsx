import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducers, addProducer, updateProducer, deleteProducer } from '../redux/producersSlice';
import type { RootState, AppDispatch } from '../redux/store';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isValidCPF, isValidCNPJ } from '../utils/validators';
import { TitleBar } from '../components/TitleBar';
import { PageContainer } from '../components/PageContainer';
import { NoResult } from '../components/NoResult';
import { ContentWrapper } from '../components/ContentWrapper';
import { SearchContainer, SearchInput, AddButton } from '../components/SearchComponent';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th,
  td {
    padding: 0.75rem;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f4f4f4;
  }

  td:last-child {
    text-align: right;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 0.5rem;
  color: #2f7a2f;

  &:hover {
    color: #1f5a1f;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 320px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const ModalHeader = styled.h3`
  margin-bottom: 1rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;

  label {
    font-weight: 500;
  }

  input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;

  button {
    margin-left: 0.5rem;
  }
`;


const StyledButton = styled.button`
  padding: 8px 16px;
  margin: 0 8px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.cancel {
    background-color: #ccc;
    color: #333;

    &:hover {
      background-color: #b3b3b3;
    }
  }

  &.save {
    background-color: #2d862d;
    color: white;

    &:hover {
      background-color: #256f25;
    }
  }
`;

const ProducersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.producers);
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceId, setDebounceId] = useState<NodeJS.Timeout>();
  const [modalOpen, setModalOpen] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newCpf, setNewCpf] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const nomeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (debounceId) clearTimeout(debounceId);

    if (searchTerm.length >= 3) {
      const id = setTimeout(() => {
        dispatch(fetchProducers(searchTerm));
        setHasSearched(true);
      }, 500);
      setDebounceId(id);
    } else {
      setHasSearched(false);
    }

    return () => {
      if (debounceId) clearTimeout(debounceId);
    };
  }, [searchTerm, dispatch]);


  useEffect(() => {
    if (modalOpen && nomeInputRef.current) {
      nomeInputRef.current.focus();
    }
  }, [modalOpen]);


  const reloadSearch = () => {
    if (searchTerm.length >= 3) {
      dispatch(fetchProducers(searchTerm));
    }
  };

  const handleAdd = async () => {
    if (!newNome.trim() || !newCpf.trim()) return;

    if (newCpf.length <= 11 && !isValidCPF(newCpf)) {
      toast.error('CPF inválido');
      return;
    }
    if (newCpf.length > 11 && !isValidCNPJ(newCpf)) {
      toast.error('CNPJ inválido');
      return;
    }

    try {
      if (editId) {
        await dispatch(updateProducer({ id: editId, nome: newNome, cpfCnpj: newCpf })).unwrap();
        toast.success('Produtor atualizado com sucesso!');
      } else {
        await dispatch(addProducer({ nome: newNome, cpfCnpj: newCpf })).unwrap();
        toast.success('Produtor adicionado com sucesso!');
      }

      reloadSearch();
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro ao salvar o produtor.';
      toast.error(errorMessage);
    }

    setModalOpen(false);
    setNewNome('');
    setNewCpf('');
    setEditId(null);

    useEffect(() => {
      dispatch(fetchProducers(''));
    }, [dispatch]);
  };

  const handleEdit = (id: string) => {
    const producer = items.find(p => p.id === id);
    if (!producer) return;
    
    setNewNome(producer.nome);
    setNewCpf(producer.cpfCnpj);
    setEditId(id);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este produtor?')) {
      try {
        await dispatch(deleteProducer(id));
        toast.success('Produtor excluído com sucesso!');
        reloadSearch();
      } catch (err) {
        toast.error('Erro ao excluir o produtor.');
      }
    }
  };

  return (
    <PageContainer>
      <TitleBar>Cadastro de Produtores</TitleBar>
      <ContentWrapper>
        <SearchContainer>
          <SearchInput
            placeholder="Procure por nome ou CPF/CNPJ"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AddButton onClick={() => {
            setModalOpen(true);
            setNewNome('');
            setNewCpf('');
            setEditId(null);
          }}>Adicionar</AddButton>
        </SearchContainer>

        {loading &&
          <NoResult>
            <p>Carregando...</p>
          </NoResult>
        }

        {hasSearched && items.length > 0 && (
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF/CNPJ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.nome}</td>
                  <td>{p.cpfCnpj}</td>
                  <td>
                    <IconButton onClick={() => handleEdit(p.id)}><FaEdit /></IconButton>
                    <IconButton onClick={() => handleDelete(p.id)}><FaTrash /></IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}


        {hasSearched && items.length == 0 && (
          <NoResult>
            <p>Nenhum produtor encontrado.</p>
          </NoResult>
        )}
      </ContentWrapper>

      {modalOpen && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>{editId ? 'Editar Produtor' : 'Adicionar Produtor'}</ModalHeader>
            <Field>
              <label>Nome</label>
              <input
                ref={nomeInputRef}
                value={newNome} onChange={(e) => setNewNome(e.target.value)} />
            </Field>
            <Field>
              <label>CPF/CNPJ</label>
              <input
                value={newCpf}
                onChange={(e) => setNewCpf(e.target.value.replace(/\D/g, '').slice(0, 14))}
                maxLength={14}
                inputMode="numeric"
                placeholder="Somente números (até 14 dígitos)"
              />
            </Field>
            <ModalActions>
              <StyledButton className="cancel" onClick={() => setModalOpen(false)}>Cancelar</StyledButton>
              <StyledButton className="save" onClick={handleAdd}>Salvar</StyledButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default ProducersPage;
