// api.ts - Configuración y funciones para llamadas al backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

// Interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  usuarioId: number;
  nombreUsuario: string;
  nombreResponsable?: string;
  rol: string;
}

export interface Usuario {
  email: string;
  usuarioId: number;
  nombreResponsable: string;
  nombre: string;
  rol: string;
}

// Añadir estas interfaces al principio del archivo (después de las existentes):
export interface RegisterRequest {
  nombreResponsable: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  token?: string;
}

export interface Ambulancia {
  idAmbulancia: number;
  nombre?: string;
  matricula?: string;
}


export interface Servicio {
  idServicio: number;
  nombreServicio: string;
}


// Interfaces para Revisión
export interface Material {
  nombreProducto: string;
  cantidad: number;
  cantidadRevisada: number;
}

export interface Cajon {
  nombreCajon: string;
  materiales: Material[];
}

export interface Zona {
  nombreZona: string;
  materiales?: Material[];
  cajones?: Cajon[];
}

export interface RevisionData {
  zonas: Zona[];
}

export interface MaterialFaltante {
  nombreProducto: string;
  cantidadFaltante: number;
  nombreZona: string;
  nombreCajon: string | null;
  ubicacion: string;
}

export interface RevisionCompleta {
  idAmbulancia: number;
  idServicio: number;
  nombreResponsable: string;
  fechaRevision: string;
  zonas: Zona[];
}

// Clase para manejar errores de API
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Función de login
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    console.log('Intentando login...', email);
    
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new ApiError(response.status, data.message || 'Email o contraseña incorrectos');
    }

    if (!data.token) {
      throw new ApiError(500, 'No se recibió token del servidor');
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    console.error('Error completo:', error);
    throw new ApiError(0, `Error de conexión con el servidor. Verifica que el backend esté corriendo en ${API_URL}`);
  }
}

// Funciones para gestión de autenticación local
export function saveAuthData(data: LoginResponse): void {
  // Guardar token (ambas versiones para compatibilidad)
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('token', data.token);
  
  // Guardar usuario completo como objeto
  const usuario: Usuario = {
    email: data.email,
    usuarioId: data.usuarioId,
    nombreResponsable: data.nombreUsuario || data.nombreResponsable || '',
    nombre: data.nombreUsuario,
    rol: data.rol
  };
  localStorage.setItem('usuario', JSON.stringify(usuario));
  
  // También guardar por separado para compatibilidad
  localStorage.setItem('userEmail', data.email);
  localStorage.setItem('userId', data.usuarioId.toString());
  localStorage.setItem('userName', data.nombreUsuario);
  localStorage.setItem('userRole', data.rol);
  
  console.log('Auth data guardada exitosamente');
}

export function clearAuthData(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
}

export function getAuthToken(): string | null {
  return localStorage.getItem('authToken') || localStorage.getItem('token');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function getUsuario(): Usuario | null {
  const usuarioStr = localStorage.getItem('usuario');
  if (!usuarioStr) return null;
  
  try {
    return JSON.parse(usuarioStr);
  } catch {
    return null;
  }
}



export async function registerUser(
  nombreResponsable: string, 
  email: string, 
  password: string
): Promise<RegisterResponse> {
  try {
    console.log('Intentando registro...', email);
    
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ nombreResponsable, email, password })
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new ApiError(response.status, data.message || 'Error al registrar usuario');
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    console.error('Error completo:', error);
    throw new ApiError(0, `Error de conexión con el servidor. Verifica que el backend esté corriendo en ${API_URL}`);
  }
}



// Función para logout completo
export function logout(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('authToken')
  localStorage.removeItem('usuario')
  localStorage.removeItem('ambulanciaSeleccionada')
  localStorage.removeItem('servicioSeleccionado')
  localStorage.removeItem('nombreResponsable')
  localStorage.removeItem('reposicionData')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userId')
  localStorage.removeItem('userName')
  localStorage.removeItem('userRole')
  
  console.log('Sesión cerrada completamente')
}


// Función para obtener ambulancias
export async function getAmbulancias(): Promise<Ambulancia[]> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new ApiError(401, 'No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/api/Ambulancia`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'Error al cargar ambulancias');
    }

    const ambulancias = await response.json();
    console.log('Ambulancias recibidas:', ambulancias);
    
    return ambulancias;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    console.error('Error completo:', error);
    throw new ApiError(0, 'Error de conexión con el servidor');
  }
}

// Función para guardar ambulancia seleccionada
export function saveAmbulanciaSeleccionada(ambulanciaId: number): void {
  localStorage.setItem('ambulanciaSeleccionada', ambulanciaId.toString());
}

export function getAmbulanciaSeleccionada(): number | null {
  const id = localStorage.getItem('ambulanciaSeleccionada');
  return id ? parseInt(id, 10) : null;
}



// Función para obtener servicios
export async function getServicios(): Promise<Servicio[]> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new ApiError(401, 'No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/api/Servicio`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'Error al cargar servicios');
    }

    const servicios = await response.json();
    console.log('Servicios recibidos:', servicios);
    
    return servicios;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    console.error('Error completo:', error);
    throw new ApiError(0, 'Error de conexión con el servidor');
  }
}

// Función para guardar servicio seleccionado
export function saveServicioSeleccionado(servicioId: number): void {
  localStorage.setItem('servicioSeleccionado', servicioId.toString());
}

export function getServicioSeleccionado(): number | null {
  const id = localStorage.getItem('servicioSeleccionado');
  return id ? parseInt(id, 10) : null;
}


// Función para guardar nombre del responsable
export function saveNombreResponsable(nombre: string): void {
  localStorage.setItem('nombreResponsable', nombre);
}

export function getNombreResponsable(): string | null {
  return localStorage.getItem('nombreResponsable');
}

// Obtener revisión de ambulancia
export async function getRevisionAmbulancia(ambulanciaId: number): Promise<RevisionData> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new ApiError(401, 'No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/api/Revision/ambulancia/${ambulanciaId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new ApiError(response.status, `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Datos de revisión recibidos:', data);
    
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    console.error('Error completo:', error);
    throw new ApiError(0, 'Error de conexión con el servidor');
  }
}

// Guardar revisión completa
export async function guardarRevision(revisionCompleta: RevisionCompleta): Promise<any> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new ApiError(401, 'No hay token de autenticación');
    }

    console.log('Guardando revisión:', revisionCompleta);

    const response = await fetch(`${API_URL}/api/Revision`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(revisionCompleta)
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'Error al guardar la revisión');
    }

    const result = await response.json();
    console.log('Revisión guardada:', result);
    
    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    console.error('Error completo:', error);
    throw new ApiError(0, 'Error al guardar la revisión');
  }
}

// Guardar/cargar estado de revisión en localStorage
export function guardarEstadoRevision(ambulanciaId: number, revisionData: RevisionData): void {
  localStorage.setItem(`revision_${ambulanciaId}`, JSON.stringify(revisionData));
}

export function cargarEstadoRevision(ambulanciaId: number): RevisionData | null {
  const estado = localStorage.getItem(`revision_${ambulanciaId}`);
  return estado ? JSON.parse(estado) : null;
}

export function limpiarEstadoRevision(ambulanciaId: number): void {
  localStorage.removeItem(`revision_${ambulanciaId}`);
}

// Guardar materiales faltantes
export function guardarMaterialesFaltantes(materiales: MaterialFaltante[]): void {
  localStorage.setItem('materialesFaltantes', JSON.stringify(materiales));
}

export function getMaterialesFaltantes(): MaterialFaltante[] | null {
  const materiales = localStorage.getItem('materialesFaltantes');
  return materiales ? JSON.parse(materiales) : null;
}


// Interfaces para Reposición
export interface Reposicion {
  id: number;
  idReposicion: number;
  idAmbulancia: number;
  nombreAmbulancia: string;
  matricula: string;
  nombreResponsable: string;
  fechaReposicion: string;
  fecha: string;
  estado: string;
  origen: string;
  materiales: any[];
  materialesFaltantes: MaterialFaltante[];
}

// Obtener ambulancia por ID
export async function getAmbulanciaById(id: number): Promise<Ambulancia | null> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new ApiError(401, 'No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/api/Ambulancia/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener ambulancia:', error);
    return null;
  }
}

// Guardar reposición
export async function guardarReposicion(reposicion: Reposicion): Promise<any> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new ApiError(401, 'No hay token de autenticación');
    }

    console.log('Guardando reposición:', reposicion);

    const response = await fetch(`${API_URL}/api/Reposicion`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reposicion)
    });

    if (response.ok) {
      console.log('Reposición guardada en backend');
      return await response.json();
    }
    
    throw new Error('Error al guardar en backend');
  } catch (error) {
    console.log('Backend no disponible, guardando solo en localStorage');
    throw error;
  }
}

// Historial de reposiciones en localStorage
export function guardarReposicionEnHistorial(reposicion: Reposicion): void {
  let historial = JSON.parse(localStorage.getItem('historialReposiciones') || '[]');
  historial.push(reposicion);
  localStorage.setItem('historialReposiciones', JSON.stringify(historial));
  console.log('Reposición guardada en historial');
}

export function getHistorialReposiciones(): Reposicion[] {
  return JSON.parse(localStorage.getItem('historialReposiciones') || '[]');
}

// Limpiar datos de revisión
export function limpiarDatosRevision(): void {
  localStorage.removeItem('materialesFaltantes');
  localStorage.removeItem('ambulanciaSeleccionada');
  localStorage.removeItem('servicioSeleccionado');
  localStorage.removeItem('nombreResponsable');
}
