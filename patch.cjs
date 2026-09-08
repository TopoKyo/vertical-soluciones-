const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Imports
code = code.replace(
  'ArrowRight\n} from "lucide-react";',
  'ArrowRight,\n  MessageCircle,\n  User,\n  Heart,\n  Newspaper\n} from "lucide-react";'
);
code = code.replace(
  'orderBy, limit } from "firebase/firestore";',
  'orderBy, limit, where } from "firebase/firestore";\nimport { Post } from "../types/forum";'
);

// 2. State
code = code.replace(
  'const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);',
  'const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);\n  const [latestPosts, setLatestPosts] = useState<Post[]>([]);'
);

// 3. Fetch
code = code.replace(
  'setFeaturedProjects(projects);',
  `setFeaturedProjects(projects);
        
        const postsQ = query(collection(db, "posts"), where("status", "in", ["Publicada", "Destacada"]), orderBy("createdAt", "desc"), limit(3));
        const postsSnap = await getDocs(postsQ);
        const fetchedPosts = postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        setLatestPosts(fetchedPosts);`
);

// 4. Section Render
const sectionHTML = `
      {/* Latest News / Forum */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl">
              <span className="text-red-500 font-bold text-xs tracking-[0.3em] uppercase mb-4 block flex items-center gap-2">
                <Newspaper className="w-4 h-4" /> Noticias y Actualizaciones
              </span>
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
                Últimas del <span className="text-red-500">Foro</span>
              </h2>
            </div>
            <Link to="/foro" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 group active:scale-95">
              Ir al Foro
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.map((post, idx) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative h-[450px] rounded-[2.5rem] overflow-hidden border border-slate-800 bg-slate-900 flex flex-col justify-end"
              >
                {post.image ? (
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-slate-800 flex items-center justify-center">
                    <Newspaper className="w-16 h-16 text-slate-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />
                
                <div className="relative p-8 z-10">
                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-4">
                    <span className="px-3 py-1 bg-red-500/20 text-red-500 rounded-full border border-red-500/20">{post.category}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(post.createdAt.toDate()).toLocaleDateString('es-CL')}</span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter mb-4 text-white line-clamp-2">
                    <Link to={\`/foro/post/\${post.slug}\`} className="hover:text-red-500 transition-colors before:absolute before:inset-0">
                      {post.title}
                    </Link>
                  </h3>
                  
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-800/50">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.authorName}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.commentsCount}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Slider */}`;

code = code.replace(
  '{/* Industries Slider */}',
  sectionHTML
);

fs.writeFileSync('src/pages/Home.tsx', code);
console.log("Done");
