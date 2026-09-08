import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Post } from '../../types/forum';
import slugify from 'slugify';
import { Edit2, Trash2, PlusCircle, ExternalLink, Image as ImageIcon, Eye, EyeOff, Star, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../../lib/firebase';

const CATEGORIES = ["Noticias", "Comunidad", "Actualizaciones", "Avisos", "Eventos", "General"];
const STATUSES = ["Publicada", "Borrador", "Oculta", "Destacada"];

export default function AdminForum() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [status, setStatus] = useState<Post['status']>('Publicada');
  const [tags, setTags] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (post: Post | null = null) => {
    if (post) {
      setEditingPost(post);
      setTitle(post.title);
      setContent(post.content);
      setExcerpt(post.excerpt);
      setImage(post.image || '');
      setCategory(post.category);
      setStatus(post.status);
      setTags(post.tags ? post.tags.join(', ') : '');
    } else {
      setEditingPost(null);
      setTitle('');
      setContent('');
      setExcerpt('');
      setImage('');
      setCategory(CATEGORIES[0]);
      setStatus('Publicada');
      setTags('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const currentUser = auth.currentUser;
      const slug = slugify(title, { lower: true, strict: true });
      const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
      
      const postData = {
        title,
        slug,
        content,
        excerpt,
        image,
        category,
        tags: tagArray,
        status,
        updatedAt: serverTimestamp(),
      };

      if (editingPost) {
        await updateDoc(doc(db, 'posts', editingPost.id), postData);
      } else {
        await addDoc(collection(db, 'posts'), {
          ...postData,
          authorId: currentUser?.uid || 'admin',
          authorName: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Administrador',
          createdAt: serverTimestamp(),
          publishedAt: serverTimestamp(),
          likes: 0,
          commentsCount: 0,
        });
      }
      
      await fetchPosts();
      closeModal();
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Error al guardar la publicación.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta publicación? (Los comentarios asociados quedarán huérfanos)")) return;
    try {
      await deleteDoc(doc(db, 'posts', id));
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const toggleStatus = async (post: Post, newStatus: Post['status']) => {
    try {
      await updateDoc(doc(db, 'posts', post.id), { status: newStatus });
      setPosts(posts.map(p => p.id === post.id ? { ...p, status: newStatus } : p));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return <div className="animate-pulse flex items-center justify-center p-20 text-slate-500 font-bold uppercase tracking-widest text-sm">Cargando publicaciones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Foro y Noticias</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Administra las publicaciones, noticias y destacados</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest italic text-sm transition-all hover:scale-105 shadow-xl shadow-red-900/20"
        >
          <PlusCircle className="w-5 h-5" />
          Crear Publicación
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl">
            <AlertCircle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No hay publicaciones</h3>
            <p className="text-slate-500 uppercase tracking-widest text-xs">Crea la primera publicación para el foro.</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
              {post.image ? (
                <img src={post.image} alt={post.title} className="w-24 h-24 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-8 h-8 text-slate-600" />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                    post.status === 'Publicada' ? 'bg-emerald-500/10 text-emerald-500' :
                    post.status === 'Borrador' ? 'bg-slate-500/10 text-slate-500' :
                    post.status === 'Destacada' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {post.status}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{post.category}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{post.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-1">{post.excerpt}</p>
                <div className="flex gap-4 mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span>{post.likes} Me gusta</span>
                  <span>{post.commentsCount} Comentarios</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <a href={`/foro/post/${post.slug}`} target="_blank" rel="noreferrer" className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors" title="Ver publicación">
                  <ExternalLink className="w-4 h-4" />
                </a>
                {post.status === 'Destacada' ? (
                  <button onClick={() => toggleStatus(post, 'Publicada')} className="p-3 bg-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white rounded-xl transition-colors" title="Quitar destacado">
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ) : (
                  <button onClick={() => toggleStatus(post, 'Destacada')} className="p-3 bg-slate-800 text-slate-400 hover:text-amber-500 hover:bg-amber-500/20 rounded-xl transition-colors" title="Destacar">
                    <Star className="w-4 h-4" />
                  </button>
                )}
                {post.status === 'Oculta' ? (
                  <button onClick={() => toggleStatus(post, 'Publicada')} className="p-3 bg-slate-800 text-slate-400 hover:text-emerald-500 rounded-xl transition-colors" title="Publicar">
                    <Eye className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={() => toggleStatus(post, 'Oculta')} className="p-3 bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl transition-colors" title="Ocultar">
                    <EyeOff className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => openModal(post)} className="p-3 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-xl transition-colors" title="Editar">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(post.id)} className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-colors" title="Eliminar">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8">
                {editingPost ? 'Editar Publicación' : 'Nueva Publicación'}
              </h2>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Título</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Categoría</label>
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white appearance-none"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Resumen (Excerpt)</label>
                  <textarea 
                    value={excerpt}
                    onChange={e => setExcerpt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Contenido (Soporta saltos de línea)</label>
                  <textarea 
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white min-h-[300px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">URL de Imagen (Opcional)</label>
                    <input 
                      type="url" 
                      value={image}
                      onChange={e => setImage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Estado</label>
                    <select 
                      value={status}
                      onChange={e => setStatus(e.target.value as Post['status'])}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white appearance-none"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Etiquetas (Separadas por coma)</label>
                  <input 
                    type="text" 
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                    placeholder="tecnología, innovación, seguridad"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-8">
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all hover:bg-slate-800 text-slate-300"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-xl shadow-red-900/20 active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? "Guardando..." : "Guardar Publicación"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
