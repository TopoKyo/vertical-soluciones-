import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, doc, updateDoc, increment, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Helmet } from 'react-helmet-async';
import { Post, Comment } from '../types/forum';
import { User, Clock, Heart, MessageCircle, Share2, ArrowLeft, Trash2 } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';

export default function ForumPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const postDoc = querySnapshot.docs[0];
          setPost({ id: postDoc.id, ...postDoc.data() } as Post);
          
          // Fetch comments
          const commentsRef = collection(db, 'comments');
          const cq = query(commentsRef, where('postId', '==', postDoc.id), orderBy('createdAt', 'desc'));
          const cSnap = await getDocs(cq);
          const cData = cSnap.docs.map(d => ({ id: d.id, ...d.data() } as Comment));
          setComments(cData);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  const handleLike = async () => {
    if (!post) return;
    try {
      const postRef = doc(db, 'posts', post.id);
      await updateDoc(postRef, {
        likes: increment(1)
      });
      setPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const commentData = {
        postId: post.id,
        content: newComment,
        authorName: currentUser ? currentUser.displayName || currentUser.email.split('@')[0] : 'Usuario Anónimo',
        authorId: currentUser ? currentUser.uid : '',
        createdAt: serverTimestamp(),
        likes: 0
      };
      
      const docRef = await addDoc(collection(db, 'comments'), commentData);
      setComments([{ id: docRef.id, ...commentData, createdAt: { toDate: () => new Date() } } as any, ...comments]);
      setNewComment('');
      
      // Update post comment count
      await updateDoc(doc(db, 'posts', post.id), {
        commentsCount: increment(1)
      });
      setPost(prev => prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : null);
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!post || !window.confirm("¿Seguro que quieres eliminar este comentario?")) return;
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      setComments(comments.filter(c => c.id !== commentId));
      
      await updateDoc(doc(db, 'posts', post.id), {
        commentsCount: increment(-1)
      });
      setPost(prev => prev ? { ...prev, commentsCount: Math.max(0, prev.commentsCount - 1) } : null);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado al portapapeles");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!post) {
    return <div className="min-h-screen pt-40 bg-slate-950 text-center text-white">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Publicación no encontrada</h1>
      <Link to="/foro" className="text-red-500 hover:underline">Volver al Foro</Link>
    </div>;
  }

  const postDate = post.createdAt?.toDate ? post.createdAt.toDate() : new Date();
  
  // JSON-LD Schema for NewsArticle
  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "image": post.image ? [post.image] : [],
    "datePublished": post.publishedAt?.toDate ? post.publishedAt.toDate().toISOString() : postDate.toISOString(),
    "dateModified": post.updatedAt?.toDate ? post.updatedAt.toDate().toISOString() : postDate.toISOString(),
    "author": [{
        "@type": "Person",
        "name": post.authorName
    }],
    "description": post.excerpt
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-950">
      <Helmet>
        <title>{post.title} | Vertical Soluciones</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={window.location.href} />
        
        {/* Open Graph / Social Media */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        {post.image && <meta property="og:image" content={post.image} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        {post.image && <meta name="twitter:image" content={post.image} />}
        
        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify(schemaOrgJSONLD)}
        </script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-6">
        <Link to="/foro" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al Foro
        </Link>

        <article>
          <header className="mb-12">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-red-500 mb-6">
              <span className="px-3 py-1 bg-red-500/10 rounded-full">{post.category}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 flex items-center gap-1"><Clock className="w-4 h-4" /> {postDate.toLocaleDateString('es-CL')}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter mb-8 leading-tight text-white">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between border-y border-slate-800 py-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-widest text-white">{post.authorName}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Autor</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button onClick={handleShare} className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
                <button onClick={handleLike} className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {post.image && (
              <div className="w-full aspect-video rounded-3xl overflow-hidden border border-slate-800 mb-12 shadow-2xl">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}
          </header>

          <div className="prose prose-invert prose-lg max-w-none mb-16 prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter prose-a:text-red-500 whitespace-pre-wrap">
            {post.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="text-slate-300 leading-relaxed min-h-[1rem]">{paragraph}</p>
            ))}
          </div>

          {/* Comments Section */}
          <section className="border-t border-slate-800 pt-16">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-3 text-white">
              <MessageCircle className="w-6 h-6 text-red-500" />
              Comentarios ({post.commentsCount})
            </h3>
            
            <form onSubmit={handleAddComment} className="mb-12">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                {!currentUser && (
                  <div className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Estás comentando como <span className="text-white">Anónimo</span>. <Link to="/admin" className="text-red-500 hover:underline">Inicia sesión</Link>
                  </div>
                )}
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe tu comentario aquí..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white min-h-[120px] mb-4 resize-none"
                  required
                />
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-red-600 text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-lg"
                  >
                    {isSubmitting ? 'Publicando...' : 'Publicar Comentario'}
                  </button>
                </div>
              </div>
            </form>

            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-full shrink-0 flex items-center justify-center text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold uppercase tracking-widest text-white">{comment.authorName}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          {comment.createdAt?.toDate ? new Date(comment.createdAt.toDate()).toLocaleDateString('es-CL') : 'Justo ahora'}
                        </span>
                      </div>
                      {(currentUser?.uid === comment.authorId || currentUser?.email === 'chinchuarchibo@gmail.com') && (
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-slate-500 hover:text-red-500 transition-colors"
                          title="Eliminar comentario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-sm font-bold uppercase tracking-widest">
                  Aún no hay comentarios. ¡Sé el primero en opinar!
                </div>
              )}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
