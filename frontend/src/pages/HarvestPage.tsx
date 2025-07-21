import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHarvests, addHarvest, updateHarvest, deleteHarvest } from '../redux/harvestSlice';
import { fetchProperties, type Property } from '../redux/propertiesSlice';
import type { RootState, AppDispatch } from '../redux/store';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

const PropertySearchInput = styled.input`
    width: 300px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  outline: none;
`;

const PropertySearchWrapper = styled.div`
  position: relative;
`;

const PropertyDropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  background: white;
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  z-index: 1000;
  border-radius: 0 0 4px 4px;

  li {
    padding: 0.5rem;
    cursor: pointer;

    &:hover {
      background-color: #f0f0f0;
    }
  }
`;

const HarvestPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading } = useSelector((state: RootState) => state.harvests);
    const [harvestSearchTerm, setHarvestSearchTerm] = useState('');
    const [propertySearchTerm, setPropertySearchTerm] = useState('');
    const [debounceId, setDebounceId] = useState<NodeJS.Timeout>();
    const [modalOpen, setModalOpen] = useState(false);
    const [newNome, setNewNome] = useState('');
    const [newPropriedadeId, setNewPropriedadeId] = useState('');
    const [newAno, setNewAno] = useState(2025);
    const [newAreaPlantada, setNewAreaPlantada] = useState(1);
    const [newCultura, setNewCultura] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const nomeInputRef = useRef<HTMLInputElement>(null);
    const [propertySearchResult, setpropertySearchResult] = useState<Property[]>([]);

    useEffect(() => {
        if (debounceId) clearTimeout(debounceId);

        if (harvestSearchTerm.length >= 3) {
            const id = setTimeout(() => {
                dispatch(fetchHarvests(harvestSearchTerm));
                setHasSearched(true);
            }, 500);
            setDebounceId(id);
        } else {
            setHasSearched(false);
        }

        return () => {
            if (debounceId) clearTimeout(debounceId);
        };
    }, [harvestSearchTerm, dispatch]);


    useEffect(() => {
        if (modalOpen && nomeInputRef.current) {
            nomeInputRef.current.focus();
        }
    }, [modalOpen]);


    useEffect(() => {
        if (debounceId) clearTimeout(debounceId);

        if (propertySearchTerm.length >= 3) {
            const id = setTimeout(() => {
                dispatch(fetchProperties(propertySearchTerm))
                    .then((result) => {
                        setpropertySearchResult(result.payload as Property[]);
                    })
                    .catch(() => toast.error('Erro ao buscar produtores'));
            }, 500);
            setDebounceId(id);
        } else {
            setpropertySearchResult([]);
        }

        return () => {
            if (debounceId) clearTimeout(debounceId);
        };
    }, [propertySearchTerm, dispatch]);

    const reloadSearch = () => {
        if (harvestSearchTerm.length >= 3) {
            dispatch(fetchHarvests(harvestSearchTerm));
        }
    };

    const handleAdd = async () => {
        if (!newNome.trim()) return;

        try {
            if (editId) {
                await dispatch(updateHarvest({
                    id: editId,
                    nome: newNome,
                    propriedadeId: newPropriedadeId,
                    ano: newAno,
                    areaPlantada: newAreaPlantada,
                    cultura: newCultura
                })).unwrap();

                toast.success('Safra atualizada com sucesso!');
            } else {
                await dispatch(addHarvest({
                    nome: newNome,
                    propriedadeId: newPropriedadeId,
                    ano: newAno,
                    areaPlantada: newAreaPlantada,
                    cultura: newCultura
                })).unwrap();

                toast.success('Safra adicionada com sucesso!');
            }

            reloadSearch();
        } catch (err: any) {
            const errorMessage = err?.message || 'Erro ao salvar safra.';
            toast.error(errorMessage);
        }

        resetForm();

        useEffect(() => {
            dispatch(fetchHarvests(''));
        }, [dispatch]);
    };

    const resetForm = () => {
        setNewNome('');
        setNewPropriedadeId('');
        setNewAno(2025);
        setNewAreaPlantada(1);
        setNewCultura('');
        setEditId(null);
        setModalOpen(false);
    }

    const handleEdit = (id: string) => {
        const producer = items.find(p => p.id === id);
        if (!producer) return;

        setNewNome(producer.nome);
        setNewPropriedadeId(producer.propriedadeId || '');
        setNewAno(producer.ano);
        setNewAreaPlantada(producer.areaPlantada);
        setNewCultura(producer.cultura);

        setEditId(id);
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Deseja realmente excluir esta safra?')) {
            try {
                await dispatch(deleteHarvest(id));
                toast.success('safra excluída com sucesso!');
                reloadSearch();
            } catch (err) {
                toast.error('Erro ao excluir safra.');
            }
        }
    };
    
    const handleSelectProdutor = (property: any) => {
        setNewPropriedadeId(property.id);
        setPropertySearchTerm(`${property.nome} - ${property.cidade}/${property.estado}`);
        setpropertySearchResult([]);
    };

    return (
        <PageContainer>
            <TitleBar>Cadastro de Safras</TitleBar>
            <ContentWrapper>
                <SearchContainer>
                    <SearchInput
                        placeholder="Procure por nome, propriedade ou cultura"
                        value={harvestSearchTerm}
                        onChange={(e) => setHarvestSearchTerm(e.target.value)}
                    />
                    <AddButton onClick={() => {
                        resetForm();
                        setModalOpen(true);
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
                                <th>Propriedade</th>
                                <th>Ano</th>
                                <th>Área Plantada</th>
                                <th>Cultura</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.nome}</td>
                                    <td>{p.propriedade?.nome || 'N/A'}</td>
                                    <td>{p.ano}</td>
                                    <td>{p.areaPlantada} ha</td>
                                    <td>{p.cultura}</td>
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
                        <ModalHeader>{editId ? 'Editar Safra' : 'Adicionar Safra'}</ModalHeader>
                        <Field>
                            <label>Nome</label>
                            <input
                                ref={nomeInputRef}
                                value={newNome} onChange={(e) => setNewNome(e.target.value)} />
                        </Field>
                        <Field>
                            <label>Fazenda</label>
                            <PropertySearchWrapper>
                                <PropertySearchInput
                                    placeholder="Buscar fazenda por nome"
                                    value={propertySearchTerm}
                                    onChange={(e) => setPropertySearchTerm(e.target.value)}
                                />
                                {propertySearchResult.length > 0 && (
                                    <PropertyDropdown>
                                        {propertySearchResult.map((p) => (
                                            <li key={p.id} onClick={() => handleSelectProdutor(p)}>
                                                {p.nome} - {p.cidade}/{p.estado}
                                            </li>
                                        ))}
                                    </PropertyDropdown>
                                )}
                            </PropertySearchWrapper>
                        </Field>

                        <Field>
                            <label>Ano</label>
                            <input
                                type="number"
                                value={newAno} onChange={(e) => setNewAno(Number(e.target.value))} />
                        </Field>
                        <Field>
                            <label>Área Plantada (ha)</label>
                            <input
                                type="number"
                                value={newAreaPlantada} onChange={(e) => setNewAreaPlantada(Number(e.target.value))} />
                        </Field>
                        <Field>
                            <label>Cultura</label>
                            <input
                                value={newCultura} onChange={(e) => setNewCultura(e.target.value)} />
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

export default HarvestPage;
