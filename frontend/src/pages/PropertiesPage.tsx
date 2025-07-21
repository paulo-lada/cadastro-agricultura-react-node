// src/pages/PropertiesPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import {
    fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty
} from '../redux/propertiesSlice';
import { fetchProducers, addProducer } from '../redux/producersSlice';
import type { Producer } from '../redux/producersSlice';
import { fetchEstados, fetchCidadesPorEstado } from '../utils/ibgeService';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { isValidCNPJ, isValidCPF } from '../utils/validators';
import { TitleBar } from '../components/TitleBar';
import { PageContainer } from '../components/PageContainer';
import { NoResult } from '../components/NoResult';
import { ContentWrapper } from '../components/ContentWrapper';
import { SearchContainer, SearchInput, AddButton } from '../components/SearchComponent';

const ProducerSearchInput = styled.input`
  width: 84%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  outline: none;
`;

const ProducerSearchWrapper = styled.div`
  position: relative;
`;

const ProducerDropdown = styled.ul`
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

  input, select {
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


const PropertiesPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading } = useSelector((state: RootState) => state.properties);
    const [propertySearchTerm, setPropertySearchTerm] = useState('');
    const [producerSearchTerm, setProducerSearchTerm] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [debounceId, setDebounceId] = useState<NodeJS.Timeout>();
    const [propertyModalOpen, setPropertyModalOpen] = useState(false);
    const [producerModalOpen, setProducerModalOpen] = useState(false);

    const [newNome, setNewNome] = useState('');
    const [newCidade, setNewCidade] = useState('');
    const [newEstado, setNewEstado] = useState('');
    const [newTotal, setNewTotal] = useState('');
    const [newAgricultavel, setNewAgricultavel] = useState('');
    const [newVegetacao, setNewVegetacao] = useState('');
    const [produtorResultados, setProdutorResultados] = useState<Producer[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [selectedProdutor, setSelectedProdutor] = useState<any | null>(null);
    const [newCpf, setNewCpf] = useState('');

    const [estados, setEstados] = useState<{ sigla: string, nome: string }[]>([]);
    const [cidades, setCidades] = useState<{ nome: string }[]>([]);

    const produtorInputRef = useRef<HTMLInputElement>(null);
    const nomeInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchEstados()
            .then(setEstados)
            .catch(() => toast.error('Erro ao carregar estados'));
    }, []);

    useEffect(() => {
        if (newEstado) {
            fetchCidadesPorEstado(newEstado)
                .then(setCidades)
                .catch(() => toast.error('Erro ao carregar cidades'));
        } else {
            setCidades([]);
        }
    }, [newEstado]);

    useEffect(() => {
        if (debounceId) clearTimeout(debounceId);

        if (propertySearchTerm.length >= 3) {
            const id = setTimeout(() => {
                dispatch(fetchProperties(propertySearchTerm))
                setHasSearched(true);
            }, 500);
            setDebounceId(id);
        } else {
            setHasSearched(false);
        }

        return () => {
            if (debounceId) clearTimeout(debounceId);
        };
    }, [propertySearchTerm, dispatch]);

    useEffect(() => {
        if (debounceId) clearTimeout(debounceId);

        if (producerSearchTerm.length >= 3) {
            const id = setTimeout(() => {
                dispatch(fetchProducers(producerSearchTerm))
                    .then((result) => {
                        setProdutorResultados(result.payload as Producer[]);
                    })
                    .catch(() => toast.error('Erro ao buscar produtores'));
            }, 500);
            setDebounceId(id);
        } else {
            setProdutorResultados([]);
        }

        return () => {
            if (debounceId) clearTimeout(debounceId);
        };
    }, [producerSearchTerm, dispatch]);

    useEffect(() => {
        if (propertyModalOpen && produtorInputRef.current) {
            produtorInputRef.current.focus();
        }
    }, [propertyModalOpen]);


    useEffect(() => {
        if (producerModalOpen && nomeInputRef.current) {
            nomeInputRef.current.focus();
        }
    }, [producerModalOpen]);


    const reloadSearch = () => {
        if (propertySearchTerm.length >= 3) {
            dispatch(fetchProperties(propertySearchTerm));
        }
    };

    const handleSelectProdutor = (produtor: any) => {
        setSelectedProdutor(produtor);
        setProducerSearchTerm(`${produtor.nome} - ${produtor.cpfCnpj}`);
        setProdutorResultados([]);
    };

    const validateHectares = () => {
        const total = parseFloat(newTotal);
        const agri = parseFloat(newAgricultavel);
        const veg = parseFloat(newVegetacao);
        return agri + veg <= total;
    };

    const handleSave = async () => {
        if (!validateHectares()) {
            toast.error('A área total deve ser maior ou igual à soma das áreas agricultável e de vegetação');
            return;
        }

        if (!newNome.trim() || !selectedProdutor || !newTotal || !newAgricultavel || !newVegetacao || !newEstado || !newCidade) {
            toast.error('Preencha todos os campos');
            return;
        }

        if ((isNaN(Number(newTotal)) || Number(newTotal) <= 0) ||
            (isNaN(Number(newAgricultavel)) || Number(newAgricultavel) < 0) ||
            (isNaN(Number(newVegetacao)) || Number(newVegetacao) < 0)) {
            toast.error('Hectares inválido');
            return;
        }

        try {
            if (editId) {
                await dispatch(updateProperty({
                    id: editId,
                    nome: newNome,
                    areaTotal: Number(newTotal),
                    areaAgricultavel: Number(newAgricultavel),
                    areaVegetacao: Number(newVegetacao),
                    estado: newEstado,
                    cidade: newCidade,
                    produtorId: selectedProdutor.id
                })).unwrap();

                toast.success('Propriedade atualizada com sucesso');
            } else {
                await dispatch(addProperty({
                    nome: newNome,
                    areaTotal: Number(newTotal),
                    areaAgricultavel: Number(newAgricultavel),
                    areaVegetacao: Number(newVegetacao),
                    estado: newEstado,
                    cidade: newCidade,
                    produtorId: selectedProdutor.id
                })).unwrap();

                toast.success('Propriedade adicionada com sucesso');
            }

            setPropertyModalOpen(false);
            resetForm();
            reloadSearch();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Erro ao salvar';
            toast.error(msg);
        }
    };

    const handleEdit = (p: any) => {
        const property = items.find(prop => prop.id === p.id);
        if (!property) return;

        setEditId(p.id);
        setNewNome(p.nome);
        setNewTotal(p.areaTotal.toString());
        setNewAgricultavel(p.areaAgricultavel.toString());
        setNewVegetacao(p.areaVegetacao.toString());
        setNewEstado(p.estado);
        setNewCidade(p.cidade);
        setSelectedProdutor(p.produtor);
        setProducerSearchTerm(`${p.produtor.nome} - ${p.produtor.cpfCnpj}`);
        setPropertyModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Deseja realmente excluir esta propriedade?')) {
            try {
                await dispatch(deleteProperty(id)).unwrap();
                toast.success('Propriedade excluída com sucesso!');
                reloadSearch();
            } catch {
                toast.error('Erro ao excluir a propriedade.');
            }
        }
    };

    const resetForm = () => {
        setEditId(null);
        setNewNome('');
        setNewTotal('');
        setNewAgricultavel('');
        setNewVegetacao('');
        setNewEstado('');
        setNewCidade('');
        setProducerSearchTerm('');
        setSelectedProdutor(null);
    };

    const handleProducerAdd = async () => {
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
            await dispatch(addProducer({ nome: newNome, cpfCnpj: newCpf })).unwrap();
            toast.success('Produtor adicionado com sucesso!');

        } catch (err: any) {
            const errorMessage = err?.message || 'Erro ao salvar o produtor.';
            toast.error(errorMessage);
        }

        setProducerModalOpen(false);
        setNewCpf('');
    };

    return (
        <PageContainer>
            <TitleBar>Cadastro de Propriedades</TitleBar>
            <ContentWrapper>
                <SearchContainer>
                    <SearchInput
                        placeholder="Buscar por nome ou cidade"
                        value={propertySearchTerm}
                        onChange={(e) => setPropertySearchTerm(e.target.value)}
                    />
                    <AddButton onClick={() => setPropertyModalOpen(true)}>Adicionar</AddButton>
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
                                <th>Cidade</th>
                                <th>Estado</th>
                                <th>Area Total</th>
                                <th>Proprietário</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.nome}</td>
                                    <td>{p.cidade}</td>
                                    <td>{p.estado}</td>
                                    <td>{p.areaTotal} ha</td>
                                    <td>{p.produtor?.nome} - {p.produtor?.cpfCnpj}</td>
                                    <td>
                                        <IconButton onClick={() => handleEdit(p)}><FaEdit /></IconButton>
                                        <IconButton onClick={() => handleDelete(p.id)}><FaTrash /></IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

                {hasSearched && items.length == 0 && (
                    <NoResult>
                        <p>Nenhuma fazenda encontrado.</p>
                    </NoResult>
                )}
            </ContentWrapper>

            {propertyModalOpen && (
                <ModalOverlay onClick={() => setPropertyModalOpen(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>Adicionar Propriedade</ModalHeader>

                        <Field>
                            <label>Produtor</label>
                            <ProducerSearchWrapper>
                                <ProducerSearchInput
                                    ref={produtorInputRef}
                                    placeholder="Buscar produtor por nome ou CPF/CNPJ"
                                    value={producerSearchTerm}
                                    onChange={(e) => setProducerSearchTerm(e.target.value)}
                                />
                                {produtorResultados.length > 0 && (
                                    <ProducerDropdown>
                                        {produtorResultados.map((p) => (
                                            <li key={p.id} onClick={() => handleSelectProdutor(p)}>
                                                {p.nome} - {p.cpfCnpj}
                                            </li>
                                        ))}
                                    </ProducerDropdown>
                                )}
                                <AddButton onClick={() => setProducerModalOpen(true)}><FaPlus /></AddButton>
                            </ProducerSearchWrapper>
                        </Field>

                        <Field>
                            <label>Nome da Fazenda</label>
                            <input value={newNome} onChange={(e) => setNewNome(e.target.value)} />
                        </Field>
                        <Field>
                            <label>Estado</label>
                            <select value={newEstado} onChange={(e) => setNewEstado(e.target.value)}>
                                <option value="">Selecione um estado</option>
                                {estados.map((e) => (
                                    <option key={e.sigla} value={e.sigla}>{e.nome}</option>
                                ))}
                            </select>
                        </Field>
                        <Field>
                            <label>Cidade</label>
                            <select value={newCidade} onChange={(e) => setNewCidade(e.target.value)}>
                                <option value="">Selecione uma cidade</option>
                                {cidades.map((c) => (
                                    <option key={c.nome} value={c.nome}>{c.nome}</option>
                                ))}
                            </select>
                        </Field>
                        <Field>
                            <label>Área Total (ha)</label>
                            <input type="number" value={newTotal} onChange={(e) => setNewTotal(e.target.value)} />
                        </Field>
                        <Field>
                            <label>Área Agricultável (ha)</label>
                            <input type="number" value={newAgricultavel} onChange={(e) => setNewAgricultavel(e.target.value)} />
                        </Field>
                        <Field>
                            <label>Área de Vegetação (ha)</label>
                            <input type="number" value={newVegetacao} onChange={(e) => setNewVegetacao(e.target.value)} />
                        </Field>
                        <ModalActions>
                            <StyledButton className="cancel" onClick={() => { setPropertyModalOpen(false); resetForm() }}>Cancelar</StyledButton>
                            <StyledButton className="save" onClick={handleSave}>Salvar</StyledButton>
                        </ModalActions>
                    </ModalContent>
                </ModalOverlay>
            )}

            {producerModalOpen && (
                <ModalOverlay onClick={() => setProducerModalOpen(false)}>
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
                            <StyledButton className="cancel" onClick={() => setProducerModalOpen(false)}>Cancelar</StyledButton>
                            <StyledButton className="save" onClick={handleProducerAdd}>Salvar</StyledButton>
                        </ModalActions>
                    </ModalContent>
                </ModalOverlay>
            )}
        </PageContainer>
    );
};

export default PropertiesPage;
