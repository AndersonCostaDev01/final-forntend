'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';

interface UserProfile {
  username: string;
  first_name: string;
  last_name: string;
  descricao: string;
  foto?: string;
}

export default function ProfilePage() {
  const apiUrl = 'https://costaanderson.pythonanywhere.com';

  const cookieRaw = Cookies.get('user');
  const token = Cookies.get('token');

  const getUserFromCookies = () => {
    if (cookieRaw && token) {
      try {
        const decoded = decodeURIComponent(cookieRaw);
        const parsed = JSON.parse(decoded);
        return { userId: parsed.user_id, token };
      } catch (error) {
        console.error('Erro ao decodificar cookie:', error);
        return null;
      }
    }
    return null;
  };

  const userInfo = getUserFromCookies();
  const userId = userInfo?.userId;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Omit<UserProfile, 'foto'>>({
    username: '',
    first_name: '',
    last_name: '',
    descricao: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!userId || !token) return;

    fetch(`${apiUrl}/users/profile/${userId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao buscar perfil');
        return res.json();
      })
      .then((data: UserProfile) => {
        setProfile(data);
        setFormData({
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
          descricao: data.descricao || '',
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar perfil:', err);
        setLoading(false);
      });
  }, [userId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpdate = () => {
    const data = new FormData();
    data.append('username', formData.username);
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('descricao', formData.descricao);
    if (selectedFile) {
      data.append('foto', selectedFile);
    }

    fetch(`${apiUrl}/users/profile/${userId}/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: data,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao atualizar perfil');
        return res.json();
      })
      .then((data: UserProfile) => {
        setProfile(data);
        setEditMode(false);
        setSelectedFile(null);
        alert('Perfil atualizado com sucesso!');
      })
      .catch((err) => {
        console.error('Erro ao atualizar perfil:', err);
        alert('Erro ao atualizar perfil.');
      });
  };

  if (loading) return <div className="text-white">Carregando perfil...</div>;
  if (!profile) return <div className="text-white">Perfil não encontrado.</div>;

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg p-6 text-white m-1 z-10 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold">Bem-vindo, {profile.first_name}!</h1>
          <p className="text-sm text-white/80">Username: {profile.username}</p>
        </div>
        <div className="rounded-full overflow-hidden border border-white/30">
          <Image
            src={
              selectedFile
                ? URL.createObjectURL(selectedFile)
                : profile.foto
                ? `${apiUrl}${profile.foto}`
                : '/avatar.png'
            }
            alt="Avatar"
            width={100}
            height={100}
          />
        </div>
      </div>

      {editMode ? (
        <div className="space-y-4">
          <input
            className="w-full p-2 rounded bg-white/10 border border-white/30"
            type="text"
            name="first_name"
            placeholder="Primeiro nome"
            value={formData.first_name}
            onChange={handleChange}
          />
          <input
            className="w-full p-2 rounded bg-white/10 border border-white/30"
            type="text"
            name="last_name"
            placeholder="Sobrenome"
            value={formData.last_name}
            onChange={handleChange}
          />
          <input
            className="w-full p-2 rounded bg-white/10 border border-white/30"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <textarea
            className="w-full p-2 rounded bg-white/10 border border-white/30"
            name="descricao"
            placeholder="Descrição"
            rows={3}
            value={formData.descricao}
            onChange={handleChange}
          />
          <input
            className="w-full p-2 bg-white/10 border border-white/30 rounded text-white"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
            >
              Salvar
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setSelectedFile(null);
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p>Nome: {profile.first_name} {profile.last_name}</p>
          <p>Username: {profile.username}</p>
          <p>Descrição: {profile.descricao || 'Sem descrição'}</p>
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Editar Perfil
          </button>
        </div>
      )}
    </div>
  );
}
