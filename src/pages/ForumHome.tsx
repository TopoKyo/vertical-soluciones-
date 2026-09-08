import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Post } from '../types/forum';
import { Search, MessageCircle, Heart, Clock, User, ArrowRight } from 'lucide-react';

const CATEGORIES = ["Noticias", "Comunidad", "Actualizaciones", "Avisos", "Eventos", "General"];

export default function ForumHome() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsRef = collection(db, 'posts');
        let q = query(postsRef, where('status', '==', 'Publicada'), orderBy('createdAt', 'desc'));
        
        // Also get Destacada
        const qDestacada = query(postsRef, where('status', '==', 'Destacada'), orderBy('createdAt', 'desc'));
        
        const [pubSnap, destSnap] = await Promise.all([getDocs(q), getDocs(qDestacada)]);
        
        const allPosts: Post[] = [];
        pubSnap.forEach(doc => allPosts.push({ id: doc.id, ...doc.data() } as Post));
        destSnap.forEach(doc => allPosts.push({ id: doc.id, ...doc.data() } as Post));
        
        // Remove duplicates and sort by date
        const uniquePosts = Array.from(new Map(allPosts.map(p => [p.id, p])).values());
        uniquePosts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

        setFeaturedPosts(uniquePosts.filter(p => p.status === 'Destacada'));
        setPosts(uniquePosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === "Todas" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-950">
      <Helmet>
        <title>Foro y Noticias | Vertical Soluciones</title>
        <meta name="description" content="Últimas noticias, actualizaciones y comunidad de Vertical Soluciones. Mantente informado sobre nuestros proyectos y eventos." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 text-white">
              Foro & <span className="text-red-500">Noticias</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Mantente al día con nuestras últimas actualizaciones, noticias de la industria y la comunidad de Vertical Soluciones.
            </p>
          </div>
          <div className="w-full md:w-auto flex items-center relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar publicaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 bg-slate-900 border border-slate-800 rounded-full pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
            />
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            
            {/* Featured Section */}
            {featuredPosts.length > 0 && activeCategory === "Todas" && !searchQuery && (
              <div className="mb-16">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Destacados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredPosts.slice(0, 2).map((post, idx) => (
                    <motion.article 
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-800 hover:border-red-500/50 transition-all shadow-xl"
                    >
                      {post.image && (
                        <div className="aspect-video w-full overflow-hidden">
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="p-8">
                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-red-500 mb-4">
                          <span className="px-3 py-1 bg-red-500/10 rounded-full">{post.category}</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 line-clamp-2 leading-tight">
                          <Link to={`/foro/post/${post.slug}`} className="hover:text-red-500 transition-colors">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest pt-6 border-t border-slate-800">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {post.authorName}</span>
                          </div>
                          <Link to={`/foro/post/${post.slug}`} className="text-white hover:text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                            Leer <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Feed */}
            <div>
              <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6">Últimas Publicaciones</h2>
              {loading ? (
                <div className="animate-pulse space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-slate-900 rounded-3xl border border-slate-800"></div>
                  ))}
                </div>
              ) : filteredPosts.length > 0 ? (
                <div className="space-y-6">
                  {filteredPosts.map(post => (
                    <article key={post.id} className="bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 md:p-8 transition-all group flex flex-col md:flex-row gap-8 items-center">
                      {post.image && (
                        <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-2xl overflow-hidden shrink-0">
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="w-full">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                          <span className="text-red-500">{post.category}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(post.createdAt.toDate()).toLocaleDateString('es-CL')}</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 leading-tight">
                          <Link to={`/foro/post/${post.slug}`} className="hover:text-red-500 transition-colors">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest pt-6 border-t border-slate-800">
                          <div className="flex items-center gap-6">
                            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {post.authorName}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {post.commentsCount || 0}</span>
                            <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {post.likes || 0}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-900 rounded-3xl border border-slate-800">
                  <p className="text-slate-500 uppercase tracking-widest font-bold text-sm">No se encontraron publicaciones.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-1/4">
            <div className="sticky top-32 space-y-8">
              {/* Categories */}
              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
                <h3 className="text-lg font-black italic uppercase tracking-tighter mb-6">Categorías</h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setActiveCategory("Todas")}
                    className={`text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${
                      activeCategory === "Todas" ? "bg-red-500 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    Todas las publicaciones
                  </button>
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${
                        activeCategory === category ? "bg-red-500 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Posts Mini */}
              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 hidden md:block">
                <h3 className="text-lg font-black italic uppercase tracking-tighter mb-6">Más Populares</h3>
                <div className="space-y-6">
                  {posts.slice().sort((a, b) => b.likes - a.likes).slice(0, 3).map(post => (
                    <div key={post.id} className="group">
                      <Link to={`/foro/post/${post.slug}`}>
                        <h4 className="text-sm font-bold leading-tight group-hover:text-red-500 transition-colors mb-2">{post.title}</h4>
                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-500" /> {post.likes}</span>
                          <span>{post.category}</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
