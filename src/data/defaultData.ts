import { Post } from "../types/forum";

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  gallery?: string[];
  serviceProvided?: string;
  client: string;
  contractedBy?: string;
  location?: string;
  executionDate?: string;
  createdAt?: any;
}

export const DEFAULT_SETTINGS = {
  phone: "+56 9 5398 8893",
  email: "contacto@verticalsoluciones.cl",
  address: "Av. Libertad 269, Viña del Mar",
  heroTagline: "Especialistas en inspecciones técnicas, evaluación de daños y trabajos en altura.",
  heroTitleLine1: "Respuesta inmediata",
  heroTitleLine2: "ante",
  heroTitleLine3: "emergencias y",
  heroTitleHighlight: "contingencias climáticas",
  heroDescription: "Ante temporales y otras contingencias, contamos con profesionales especializados en inspecciones técnicas, catastros, evaluación de daños y reparaciones en altura. Elaboramos informes técnicos firmados por un Constructor Civil para puentes, edificios, edificios gubernamentales, condominios, industrias y todo tipo de estructuras. Contáctenos para coordinar una visita técnica y recibir una solución rápida, segura y profesional",
  latestProjectId: "0MUQS7K5cXquLe17ZJ7f"
};

export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: "0MUQS7K5cXquLe17ZJ7f",
    title: "Estructura de Protección y Retiro de Enchapes (Edificio Balmaceda)",
    category: "Trabajos Verticales",
    serviceProvided: "Estructura de protección y retiro de enchapes",
    client: "Comunidad Edificio Balmaceda",
    contractedBy: "Comunidad Edificio Balmaceda",
    location: "Pasaje Balmaceda 321, Viña del Mar, Valparaíso",
    executionDate: "Julio 2024",
    description: "Los trabajos consideran la instalación de estructuras de protección para resguardar las áreas de trabajo, peatones y elementos existentes durante la ejecución de la obra. Asimismo, se contempla el retiro de enchapes deteriorados o en desuso, incluyendo su desmontaje, acopio, carga, transporte y disposición final en un lugar autorizado, dejando las superficies limpias y preparadas para las etapas posteriores del proyecto. Todas las actividades se ejecutaron bajo los más altos protocolos de seguridad y certificación IRATA.",
    image: "/reparacion-alturas.jpg",
    gallery: ["/reparacion-alturas.jpg", "/dificil-acceso.jpg", "/trabajos-verticales.jpg"]
  },
  {
    id: "proj-sheraton",
    title: "Limpieza de Ventanas Hotel Sheraton & Convention Center",
    category: "Limpieza en Altura",
    serviceProvided: "Limpieza técnica de vidrios y ventanales",
    client: "Gabriel Lempesi",
    contractedBy: "Hotel Sheraton & Convention Center",
    location: "Providencia, Región Metropolitana",
    executionDate: "Marzo 2022",
    description: "Se llevó a cabo la limpieza de ventanas utilizando técnicas de descenso por cuerda semiestática en un escenario desafiante donde no era posible utilizar anclajes convencionales. En su lugar, se implementaron anclajes estructurales certificados que garantizaron la máxima estabilidad. El equipo alcanzó cada rincón de difícil acceso dejando terminaciones cristalinas sin marcas.",
    image: "/limpieza-fachadas.jpg",
    gallery: ["/limpieza-fachadas.jpg", "/technician.jpg"]
  },
  {
    id: "proj-santa-clara",
    title: "Restauración y Pintura Edificio Santa Clara II",
    category: "Pintura y Reparación",
    serviceProvided: "Primera limpieza de vidrios, sellos de ventana y pintura de fachada",
    client: "Nicolás Gómez",
    contractedBy: "Constructora UPC",
    location: "La Cisterna, Región Metropolitana",
    executionDate: "Abril – Agosto 2022",
    description: "Servicios especializados en sellado de ventanas hermético y eficiente energéticamente. Se realizó además la primera limpieza técnica de cristales y la corrección de multitonalidades en la fachada mediante pintura de alta adherencia y durabilidad exterior.",
    image: "/pintura-industrias.jpg",
    gallery: ["/pintura-industrias.jpg", "/background-worker.jpg"]
  },
  {
    id: "proj-molinos",
    title: "Sellos y Junquillos Molinos de Santa Ana",
    category: "Mantenimiento",
    serviceProvided: "Sellos estructurales y junquillos de ventanas",
    client: "Jaime Riquelme (Aluvima)",
    contractedBy: "Constructora Alborada",
    location: "Villa Alemana, Región de Valparaíso",
    executionDate: "Octubre 2022",
    description: "Aplicación de sellos de poliuretano y silicona estructural de alta elasticidad junto con la reposición de junquillos en el proyecto Molinos de Santa Ana, asegurando estanqueidad hídrica y aislamiento térmico óptimo.",
    image: "/reparacion-alturas.jpg",
    gallery: ["/reparacion-alturas.jpg"]
  },
  {
    id: "proj-altos-quintay",
    title: "Aplicación de Grano y Pintura Altos de Quintay",
    category: "Obras Civiles y Terminaciones",
    serviceProvided: "Aplicación de grano y pintura bajo alero",
    client: "Luis Castro",
    contractedBy: "Altos de Quintay",
    location: "Quintay, Casablanca, Región de Valparaíso",
    executionDate: "Marzo 2023",
    description: "Ejecución de revestimiento texturado y pintura bajo aleros en zona costera de alta exigencia climática. El descenso por cuerda permitió sortear la compleja geometría de los voladizos sin necesidad de andamios invasivos.",
    image: "/trabajos-verticales.jpg",
    gallery: ["/trabajos-verticales.jpg", "/lineas-vida.jpg"]
  },
  {
    id: "proj-morande-sur",
    title: "Renovación de Pintura Fachada Morandé Sur",
    category: "Pintura y Reparación",
    serviceProvided: "Aplicación de pintura técnica en fachada",
    client: "INRETEC",
    contractedBy: "Juan Zenteno",
    location: "Santiago Centro, Región Metropolitana",
    executionDate: "Octubre 2023",
    description: "Renovación integral del revestimiento de pintura exterior en altura en el centro neurálgico de Santiago, cumpliendo los más estrictos estándares de señalización vial, líneas de vida y seguridad peatonal.",
    image: "/mantenimiento-industrial.jpg",
    gallery: ["/mantenimiento-industrial.jpg"]
  },
  {
    id: "proj-mall-boulevard",
    title: "Reparación y Pintura Edificio Mall Boulevard",
    category: "Comercial e Industrial",
    serviceProvided: "Reparación de parches, tratamiento de metales y pintura acrílica",
    client: "Grupo Marina",
    contractedBy: "INGEREV",
    location: "Viña del Mar, Región de Valparaíso",
    executionDate: "Mayo 2024",
    description: "Restauración de la fachada del Mall Boulevard: remoción de parches defectuosos con martelina, lijado, aplicación de primer sellador, retiro de toldos obsoletos y aplicación de pintura elastomérica de alta resistencia con protección UV.",
    image: "/dificil-acceso.jpg",
    gallery: ["/dificil-acceso.jpg", "/pintura-industrias.jpg"]
  },
  {
    id: "proj-ferrovial",
    title: "Fortificación de Talud Ejes 1-38 Ferrovial",
    category: "Obras Civiles y Taludes",
    serviceProvided: "Fortificación de talud con malla metálica MFI y anclajes",
    client: "Ferrovial Construcción Chile S.A.",
    contractedBy: "Vertical Soluciones SPA",
    location: "Av. Presidente Riesco 4450, Las Condes, RM",
    executionDate: "Marzo a Agosto 2024",
    description: "Estabilización y fortificación geotécnica en excavación profunda. Izaje y anclaje de malla de alta resistencia mediante cuerdas y pernos expansivos, garantizando la seguridad operacional de faena.",
    image: "/ferrovial-15.jpg",
    gallery: ["/ferrovial-15.jpg", "/background-worker.jpg"]
  },
  {
    id: "proj-genova",
    title: "Reparación y Pintura Edificio Génova",
    category: "Mantenimiento de Fachadas",
    serviceProvided: "Reparación integral de fisuras y pintura de fachada",
    client: "Comunidad Edificio Génova",
    contractedBy: "Comunidad Edificio Génova",
    location: "12 Norte 623, Viña del Mar, Región de Valparaíso",
    executionDate: "2024",
    description: "Inspección meticulosa de grietas, desprendimientos y reposición de estucos deteriorados por el clima costero. Posteriormente se aplicó imprimante fijador y esmalte hidrófugo de larga duración.",
    image: "/impermeabilizacion.jpg",
    gallery: ["/impermeabilizacion.jpg"]
  },
  {
    id: "proj-olas-mar",
    title: "Impermeabilización y Pintura Edificio Olas del Mar",
    category: "Impermeabilización",
    serviceProvided: "Tratamiento hidrófugo, sellado y pintura",
    client: "Comunidad Olas del Mar",
    contractedBy: "Comunidad Olas del Mar",
    location: "Sol y Mar 155, Viña del Mar, Valparaíso",
    executionDate: "2024",
    description: "Restitución estética y estructural de superficies exteriores con foco en la eliminación de filtraciones marinas. Sellado integral de juntas y recubrimiento con membrana impermeable flexible.",
    image: "/impermeabilizacion.jpg",
    gallery: ["/impermeabilizacion.jpg", "/technician.jpg"]
  }
];

export const DEFAULT_POSTS: Post[] = [
  {
    id: "post-1",
    title: "Normativa de Seguridad en Trabajos Verticales e IRATA en Chile",
    slug: "normativa-seguridad-trabajos-verticales-irata-chile",
    content: "En el rubro del acceso por cuerdas, la rigurosidad técnica y las certificaciones internacionales como IRATA y ANETVA son indispensables para garantizar maniobras seguras y eficientes.\n\nEn Vertical Soluciones implementamos sistemas redundantes con doble cuerda semiestática independiente, arneses integrales certificados y planes de rescate continuo en cada una de nuestras faenas.\n\nLa seguridad de nuestro equipo técnico y de las instalaciones de nuestros clientes es el pilar fundamental que guía cada operación.",
    excerpt: "Conoce los estándares y protocolos internacionales IRATA y ANETVA que aplicamos en cada trabajo de altura.",
    category: "Noticias",
    image: "/trabajos-verticales.jpg",
    authorId: "admin",
    authorName: "Vertical Soluciones",
    status: "Publicada",
    createdAt: { 
      toDate: () => new Date("2026-08-15"), 
      toMillis: () => new Date("2026-08-15").getTime(),
      seconds: 1786795200 
    } as any,
    likes: 12,
    commentsCount: 3
  },
  {
    id: "post-2",
    title: "Mantenimiento Preventivo de Fachadas ante Temporales Costeros",
    slug: "mantenimiento-preventivo-fachadas-temporales-costeros",
    content: "Las condiciones costeras de Viña del Mar y Valparaíso exigen una atención constante sobre el sellado de ventanales y la impermeabilización de muros expuestos al salitre y vientos huracanados.\n\nUna inspección a tiempo permite identificar microfisuras antes de que se conviertan en filtraciones destructivas para la estructura del edificio.\n\nNuestro equipo técnico realiza catastros y evaluaciones con informes técnicos firmados por Constructor Civil.",
    excerpt: "Recomendaciones clave para proteger edificios y condominios frente al clima invernal en la Quinta Región.",
    category: "Actualizaciones",
    image: "/impermeabilizacion.jpg",
    authorId: "admin",
    authorName: "Vertical Soluciones",
    status: "Publicada",
    createdAt: { 
      toDate: () => new Date("2026-08-28"), 
      toMillis: () => new Date("2026-08-28").getTime(),
      seconds: 1787918400 
    } as any,
    likes: 19,
    commentsCount: 5
  },
  {
    id: "post-3",
    title: "Innovación en Estructuras de Protección y Retiro de Enchapes",
    slug: "innovacion-estructuras-proteccion-retiro-enchapes",
    content: "El desprendimiento de enchapes en edificios antiguos representa un grave peligro para peatones y residentes.\n\nMediante la instalación de mallas y pantallas de retención de alta resistencia, logramos retirar elementos en riesgo sin interrumpir el tránsito ni comprometer la estética del inmueble.\n\nContamos con personal altamente calificado para maniobras de descenso controlado y retiro seguro de escombros en altura.",
    excerpt: "Cómo abordamos la recuperación de fachadas con desprendimiento de cerámicos y enchapes de manera segura.",
    category: "Comunidad",
    image: "/reparacion-alturas.jpg",
    authorId: "admin",
    authorName: "Vertical Soluciones",
    status: "Publicada",
    createdAt: { 
      toDate: () => new Date("2026-09-02"), 
      toMillis: () => new Date("2026-09-02").getTime(),
      seconds: 1788350400 
    } as any,
    likes: 8,
    commentsCount: 2
  }
];
