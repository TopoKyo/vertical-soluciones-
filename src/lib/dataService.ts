import { db } from "./firebase";
import { collection, doc, getDoc, getDocs, query, orderBy, limit, where, setDoc, addDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { DEFAULT_PROJECTS, DEFAULT_SETTINGS, DEFAULT_POSTS, ProjectData } from "../data/defaultData";
import { Post, Comment } from "../types/forum";

const CACHE_PROJECTS_KEY = "vs_cached_projects";
const CACHE_SETTINGS_KEY = "vs_cached_settings";
const CACHE_POSTS_KEY = "vs_cached_posts";

function isQuotaError(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || "").toLowerCase();
  const code = (err.code || "").toLowerCase();
  return (
    code.includes("resource-exhausted") ||
    code.includes("quota") ||
    msg.includes("quota") ||
    msg.includes("resource-exhausted") ||
    msg.includes("429")
  );
}

export async function fetchSettings(): Promise<typeof DEFAULT_SETTINGS> {
  let localSettings: typeof DEFAULT_SETTINGS | null = null;
  try {
    const cached = localStorage.getItem(CACHE_SETTINGS_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed === "object") {
        localSettings = { ...DEFAULT_SETTINGS, ...parsed };
      }
    }
  } catch {}

  try {
    const docRef = doc(db, "settings", "contact");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const remoteData = docSnap.data();
      // Merge remote data with local user preference, preserving user's latestProjectId selection
      const data = { 
        ...DEFAULT_SETTINGS, 
        ...remoteData,
        ...(localSettings || {})
      };
      try {
        localStorage.setItem(CACHE_SETTINGS_KEY, JSON.stringify(data));
      } catch {}
      return data;
    }
  } catch (err: any) {
    if (isQuotaError(err)) {
      console.warn("Firestore quota reached for settings, serving cached/default data.");
    } else {
      console.warn("Could not load Firestore settings, using fallback:", err?.message || err);
    }
  }

  if (localSettings) {
    return localSettings;
  }

  return DEFAULT_SETTINGS;
}

export async function fetchProjectsList(): Promise<ProjectData[]> {
  try {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const projects = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ProjectData));
      try {
        localStorage.setItem(CACHE_PROJECTS_KEY, JSON.stringify(projects));
      } catch {}
      return projects;
    }
  } catch (err: any) {
    if (isQuotaError(err)) {
      console.warn("Firestore quota reached for projects list, serving cached/default dossier projects.");
    } else {
      console.warn("Could not load projects from Firestore, serving fallback:", err?.message || err);
    }
  }

  // Fallback to localStorage cache if available
  try {
    const cached = localStorage.getItem(CACHE_PROJECTS_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  return DEFAULT_PROJECTS;
}

export async function fetchProjectById(id: string): Promise<ProjectData | null> {
  if (!id) return null;

  // 1. Check localStorage cache first so user edits are always returned
  try {
    const cached = localStorage.getItem(CACHE_PROJECTS_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        const found = parsed.find(p => p.id === id);
        if (found) return found;
      }
    }
  } catch {}

  // 2. Try Firestore
  try {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ProjectData;
    }
  } catch (err: any) {
    if (isQuotaError(err)) {
      console.warn(`Firestore quota reached for project ${id}, serving local dossier data.`);
    } else {
      console.warn(`Could not load project ${id} from Firestore:`, err?.message || err);
    }
  }

  // 3. Check in-memory defaults
  const fallback = DEFAULT_PROJECTS.find(p => p.id === id);
  if (fallback) return fallback;

  // 4. Match by title or partial
  const matched = DEFAULT_PROJECTS.find(p => 
    p.title.toLowerCase().includes(id.toLowerCase()) || 
    id.toLowerCase().includes(p.id.toLowerCase())
  );
  if (matched) return matched;

  return DEFAULT_PROJECTS[0];
}

export async function setFeaturedProjectId(projectId: string): Promise<void> {
  const currentSettings = await fetchSettings();
  const updatedSettings = {
    ...currentSettings,
    latestProjectId: projectId
  };
  await saveSettings(updatedSettings);
}

export async function fetchPostsList(limitCount: number = 6): Promise<Post[]> {
  try {
    const postsQ = query(
      collection(db, "posts"),
      where("status", "in", ["Publicada", "Destacada"]),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(postsQ);
    if (!snapshot.empty) {
      const posts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Post));
      try {
        localStorage.setItem(CACHE_POSTS_KEY, JSON.stringify(posts));
      } catch {}
      return posts;
    }
  } catch (err: any) {
    if (isQuotaError(err)) {
      console.warn("Firestore quota reached for posts, serving cached/default posts.");
    } else {
      console.warn("Could not fetch posts from Firestore:", err?.message || err);
    }
  }

  try {
    const cached = localStorage.getItem(CACHE_POSTS_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  return DEFAULT_POSTS.slice(0, limitCount);
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const fallback = DEFAULT_POSTS.find(p => p.slug === slug);

  try {
    const q = query(collection(db, "posts"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const postDoc = querySnapshot.docs[0];
      return { id: postDoc.id, ...postDoc.data() } as Post;
    }
  } catch (err: any) {
    if (isQuotaError(err)) {
      console.warn(`Firestore quota reached for post ${slug}, serving default article.`);
    } else {
      console.warn(`Could not fetch post ${slug}:`, err?.message || err);
    }
  }

  return fallback || DEFAULT_POSTS[0];
}

export function formatDate(dateVal: any, options?: Intl.DateTimeFormatOptions): string {
  if (!dateVal) return "Reciente";
  try {
    if (typeof dateVal?.toDate === "function") {
      return dateVal.toDate().toLocaleDateString("es-CL", options);
    }
    if (dateVal instanceof Date) {
      return dateVal.toLocaleDateString("es-CL", options);
    }
    if (dateVal.seconds) {
      return new Date(dateVal.seconds * 1000).toLocaleDateString("es-CL", options);
    }
    if (typeof dateVal === "string" || typeof dateVal === "number") {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("es-CL", options);
      }
    }
  } catch {}
  return "Reciente";
}

export function formatDateTime(dateVal: any): string {
  if (!dateVal) return "Recién enviado";
  try {
    if (typeof dateVal?.toDate === "function") {
      return dateVal.toDate().toLocaleString("es-CL");
    }
    if (dateVal instanceof Date) {
      return dateVal.toLocaleString("es-CL");
    }
    if (dateVal.seconds) {
      return new Date(dateVal.seconds * 1000).toLocaleString("es-CL");
    }
    if (typeof dateVal === "string" || typeof dateVal === "number") {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) {
        return d.toLocaleString("es-CL");
      }
    }
  } catch {}
  return "Recién enviado";
}

export function getTimeMillis(dateVal: any): number {
  if (!dateVal) return 0;
  try {
    if (typeof dateVal?.toMillis === "function") {
      return dateVal.toMillis();
    }
    if (typeof dateVal?.toDate === "function") {
      return dateVal.toDate().getTime();
    }
    if (dateVal instanceof Date) {
      return dateVal.getTime();
    }
    if (dateVal.seconds) {
      return dateVal.seconds * 1000;
    }
    if (typeof dateVal === "string" || typeof dateVal === "number") {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) return d.getTime();
    }
  } catch {}
  return 0;
}

export async function saveProject(data: Partial<ProjectData> & { id?: string }): Promise<ProjectData> {
  const currentProjects = await fetchProjectsList();
  let updatedProject: ProjectData;

  if (data.id) {
    const existingIndex = currentProjects.findIndex(p => p.id === data.id);
    const existing = existingIndex >= 0 ? currentProjects[existingIndex] : null;

    updatedProject = {
      ...(existing || {}),
      ...data,
      id: data.id,
      title: data.title || existing?.title || "Proyecto",
      category: data.category || existing?.category || "Trabajos Verticales",
      description: data.description || existing?.description || "",
      image: data.image || existing?.image || "/reparacion-alturas.jpg",
      gallery: data.gallery || existing?.gallery || [],
      serviceProvided: data.serviceProvided || existing?.serviceProvided || "",
      client: data.client || existing?.client || "Vertical Soluciones",
      contractedBy: data.contractedBy || existing?.contractedBy || "",
      location: data.location || existing?.location || "",
      executionDate: data.executionDate || existing?.executionDate || "",
      createdAt: existing?.createdAt || new Date().toISOString()
    };

    let updatedList: ProjectData[];
    if (existingIndex >= 0) {
      updatedList = [...currentProjects];
      updatedList[existingIndex] = updatedProject;
    } else {
      updatedList = [updatedProject, ...currentProjects];
    }

    try {
      localStorage.setItem(CACHE_PROJECTS_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn("Storage warning when saving project:", e);
    }

    try {
      await setDoc(doc(db, "projects", data.id), {
        title: updatedProject.title,
        category: updatedProject.category,
        description: updatedProject.description,
        image: updatedProject.image,
        gallery: updatedProject.gallery || [],
        serviceProvided: updatedProject.serviceProvided || "",
        client: updatedProject.client,
        contractedBy: updatedProject.contractedBy || "",
        location: updatedProject.location || "",
        executionDate: updatedProject.executionDate || "",
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (remoteErr) {
      console.warn("Could not sync project edit to Firestore, saved locally:", remoteErr);
    }

    return updatedProject;
  } else {
    const newId = "proj-" + Date.now();
    updatedProject = {
      id: newId,
      title: data.title || "Nuevo Proyecto",
      category: data.category || "Trabajos Verticales",
      description: data.description || "",
      image: data.image || "/reparacion-alturas.jpg",
      gallery: data.gallery || [],
      serviceProvided: data.serviceProvided || "",
      client: data.client || "Vertical Soluciones",
      contractedBy: data.contractedBy || "",
      location: data.location || "",
      executionDate: data.executionDate || "",
      createdAt: new Date().toISOString()
    };

    const updatedList = [updatedProject, ...currentProjects];
    try {
      localStorage.setItem(CACHE_PROJECTS_KEY, JSON.stringify(updatedList));
    } catch {}

    try {
      await setDoc(doc(db, "projects", newId), {
        ...updatedProject,
        createdAt: serverTimestamp()
      });
    } catch (remoteErr) {
      console.warn("Could not sync new project to Firestore, saved locally:", remoteErr);
    }

    return updatedProject;
  }
}

export async function deleteProjectById(id: string): Promise<void> {
  const currentProjects = await fetchProjectsList();
  const updatedList = currentProjects.filter(p => p.id !== id);
  try {
    localStorage.setItem(CACHE_PROJECTS_KEY, JSON.stringify(updatedList));
  } catch {}

  try {
    await deleteDoc(doc(db, "projects", id));
  } catch (remoteErr) {
    console.warn("Could not delete from Firestore, deleted from local cache:", remoteErr);
  }
}

export async function saveSettings(newSettings: any): Promise<void> {
  try {
    localStorage.setItem(CACHE_SETTINGS_KEY, JSON.stringify(newSettings));
  } catch {}

  try {
    await setDoc(doc(db, "settings", "contact"), {
      ...newSettings,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (remoteErr) {
    console.warn("Could not save settings to Firestore, saved locally:", remoteErr);
  }
}
