import React, { useState } from 'react';
import {
  Building,
  Image,
  Clock,
  Save,
  RefreshCw,
  UploadCloud,
  Trash2,
  Edit
} from 'lucide-react';

export default function PartnerProfilePage() {
  const [formData, setFormData] = useState({
    companyName: 'Laboratório Diagnóstico Plus',
    description: 'Oferecemos uma vasta gama de exames laboratoriais e de imagem com tecnologia de ponta e uma equipe altamente qualificada. Nosso foco é fornecer diagnósticos precisos com agilidade e conforto para nossos pacientes.',
  });
  
  // Estados para pré-visualização das imagens
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [photosPreview, setPhotosPreview] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoPreview(URL.createObjectURL(file));
    }
  };
  
  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const previews = files.map(file => URL.createObjectURL(file));
      setPhotosPreview(previews);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Salvando perfil do parceiro:", { formData, logoPreview, photosPreview });
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      alert('Perfil atualizado com sucesso!');
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Perfil Público</h1>
            <p className="text-gray-500">Estas são as informações que os pacientes verão ao encontrar sua clínica na plataforma.</p>
        </div>
        {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 text-sm">
                <Edit size={16}/> Editar Perfil
            </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border space-y-8">
        
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 border-b pb-2">
                <Building className="w-6 h-6 text-emerald-600" />
                Informações da Clínica
            </h2>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Clínica / Laboratório</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleFormChange} disabled={!isEditing} className="w-full p-2 border rounded-lg bg-gray-50 disabled:bg-gray-100" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Curta</label>
              <textarea name="description" value={formData.description} onChange={handleFormChange} rows={4} disabled={!isEditing} className="w-full p-2 border rounded-lg bg-gray-50 disabled:bg-gray-100" placeholder="Descreva sua clínica, seus diferenciais e especialidades..." required></textarea>
            </div>
        </div>

        <div className="space-y-6">
           <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 border-b pb-2">
                <Image className="w-6 h-6 text-emerald-600" />
                Imagens
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logotipo</label>
                    <input type="file" onChange={handleLogoChange} disabled={!isEditing} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-50"/>
                    {logoPreview && <img src={logoPreview} alt="Pré-visualização do logo" className="mt-4 w-32 h-32 object-cover rounded-lg border"/>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fotos do Espaço (até 5)</label>
                    <input type="file" onChange={handlePhotosChange} multiple disabled={!isEditing} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-50"/>
                    {photosPreview.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                            {photosPreview.map((src, index) => (
                                <img key={index} src={src} alt={`Pré-visualização ${index + 1}`} className="w-full h-24 object-cover rounded-lg border"/>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        {isEditing && (
            <div className="pt-5 border-t">
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300"
                  >
                     {isLoading ? <RefreshCw className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}
                     {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
            </div>
        )}
      </form>
    </div>
  );
}