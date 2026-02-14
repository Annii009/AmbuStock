// api.ts - Configuración y funciones para llamadas al backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

// Interfaces

// Auth
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

export interface RegisterRequest {
  nombreResponsable: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  token?: string;
}

// Usuario
export interface Usuario {
  email: string;
  usuarioId: number;
  nombreResponsable: string;
  nombre: string;
  rol: string;
}

export interface UsuarioResponsable {
  idUsuario?: number;
  nombreUsuario: string;
  rol: string;
  email: string;
  password?: string;
}

// Ambulancia y Servicio
export interface Ambulancia {
  idAmbulancia: number;
  nombre?: string;
  matricula?: string;
}

export interface Servicio {
  idServicio: number;
  nombreServicio: string;
}

// Revisión
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

export interface Revision {
  idRevision: number;
  nombreAmbulancia: string;
  matricula: string;
  nombreResponsable: string;
  fechaRevision: string;
  estado?: string;
  totalMateriales?: number;
  materialesRevisados?: number;
}

// Material y Reposición
export interface MaterialProducto {
  idMaterial: number;
  nombreProducto: string;
}

export interface MaterialSeleccionado extends MaterialProducto {
  cantidad: number;
}

export interface MaterialReposicion {
  nombreProducto?: string;
  nombre?: string;
  stockActual?: number;
  cantidadFaltante?: number;
  cantidad?: number;
  ubicacion?: string;
  nombreZona?: string;
}

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

export interface ReposicionDetalle {
  id: number;
  idReposicion: number;
  nombreAmbulancia: string;
  matricula: string;
  nombreResponsable: string;
  fechaReposicion: string;
  fecha: string;
  estado: string;
  materiales?: MaterialReposicion[];
  materialesFaltantes?: MaterialReposicion[];
}

export interface ReposicionData {
  materiales: MaterialSeleccionado[];
  servicio: string;
  responsable: string;
  ambulancia: Ambulancia;
}

export interface FotoSeleccionada {
  file: File;
  dataUrl: string;
}

export interface ReposicionCompletaData extends ReposicionData {
  comentarios?: string;
  fotos?: FotoSeleccionada[];
}

// Error handling

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper functions

function getAuthHeaders(token: string): HeadersInit {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
}

async function handleResponse<T>(response: Response, errorMessage: string): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(response.status, data.message || errorMessage);
  }
  return response.json();
}

// Autenticación

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await handleResponse<LoginResponse>(response, 'Email o contraseña incorrectos');

    if (!data.token) {
      throw new ApiError(500, 'No se recibió token del servidor');
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, `Error de conexión con el servidor en ${API_URL}`);
  }
}

export async function registerUser(
  nombreResponsable: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ nombreResponsable, email, password })
    });

    return handleResponse<RegisterResponse>(response, 'Error al registrar usuario');
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, `Error de conexión con el servidor en ${API_URL}`);
  }
}

export function saveAuthData(data: LoginResponse): void {
  const usuario: Usuario = {
    email: data.email,
    usuarioId: data.usuarioId,
    nombreResponsable: data.nombreUsuario || data.nombreResponsable || '',
    nombre: data.nombreUsuario,
    rol: data.rol
  };

  localStorage.setItem('authToken', data.token);
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify(usuario));
  localStorage.setItem('userEmail', data.email);
  localStorage.setItem('userId', data.usuarioId.toString());
  localStorage.setItem('userName', data.nombreUsuario);
  localStorage.setItem('userRole', data.rol);
}

export function clearAuthData(): void {
  const authKeys = ['authToken', 'token', 'usuario', 'userEmail', 'userId', 'userName', 'userRole'];
  authKeys.forEach(key => localStorage.removeItem(key));
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

export function logout(): void {
  const keysToRemove = [
    'token', 'authToken', 'usuario', 'ambulanciaSeleccionada',
    'servicioSeleccionado', 'nombreResponsable', 'reposicionData',
    'userEmail', 'userId', 'userName', 'userRole'
  ];
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

export function isAdmin(): boolean {
  const usuario = getUsuario();
  return usuario?.rol === 'Administrador';
}

export function getNombreUsuario(): string {
  const usuario = getUsuario();

  if (!usuario) return 'USUARIO';

  const nombre = usuario.nombreResponsable || usuario.nombre || usuario.email?.split('@')[0];
  return nombre ? nombre.toUpperCase() : 'USUARIO';
}

// Ambulancias

export async function getAmbulancias(): Promise<Ambulancia[]> {
  const token = getAuthToken();
  if (!token) throw new ApiError(401, 'No hay token de autenticación');

  try {
    const response = await fetch(`${API_URL}/api/Ambulancia`, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });

    return handleResponse<Ambulancia[]>(response, 'Error al cargar ambulancias');
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, 'Error de conexión con el servidor');
  }
}

export async function getAmbulanciaById(id: number): Promise<Ambulancia | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/Ambulancia/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });

    return response.ok ? response.json() : null;
  } catch {
    return null;
  }
}

export function saveAmbulanciaSeleccionada(ambulanciaId: number): void {
  localStorage.setItem('ambulanciaSeleccionada', ambulanciaId.toString());
}

export function getAmbulanciaSeleccionada(): number | null {
  const id = localStorage.getItem('ambulanciaSeleccionada');
  return id ? parseInt(id, 10) : null;
}

// Servicios

export async function getServicios(): Promise<Servicio[]> {
  const token = getAuthToken();
  if (!token) throw new ApiError(401, 'No hay token de autenticación');

  try {
    const response = await fetch(`${API_URL}/api/Servicio`, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });

    return handleResponse<Servicio[]>(response, 'Error al cargar servicios');
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, 'Error de conexión con el servidor');
  }
}

export function saveServicioSeleccionado(servicioId: number): void {
  localStorage.setItem('servicioSeleccionado', servicioId.toString());
}

export function getServicioSeleccionado(): number | null {
  const id = localStorage.getItem('servicioSeleccionado');
  return id ? parseInt(id, 10) : null;
}

// Materiales

export async function getMateriales(): Promise<MaterialProducto[]> {
  const token = getAuthToken();
  if (!token) throw new ApiError(401, 'No hay token de autenticación');

  try {
    const response = await fetch(`${API_URL}/api/Material`, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });

    return handleResponse<MaterialProducto[]>(response, 'Error al cargar materiales');
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, 'Error de conexión con el servidor');
  }
}

// Revisiones

export async function getRevisionAmbulancia(ambulanciaId: number): Promise<RevisionData> {
  const token = getAuthToken();
  if (!token) throw new ApiError(401, 'No hay token de autenticación');

  try {
    const response = await fetch(`${API_URL}/api/Revision/ambulancia/${ambulanciaId}`, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });

    return handleResponse<RevisionData>(response, `Error al obtener revisión`);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, 'Error de conexión con el servidor');
  }
}

export async function guardarRevision(revisionCompleta: RevisionCompleta): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new ApiError(401, 'No hay token de autenticación');

  try {
    const response = await fetch(`${API_URL}/api/Revision`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(revisionCompleta)
    });

    return handleResponse(response, 'Error al guardar la revisión');
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, 'Error al guardar la revisión');
  }
}

export async function getHistorialRevisiones(): Promise<Revision[]> {
  const token = getAuthToken();
  if (!token) throw new ApiError(401, 'No hay token de autenticación');

  try {
    const response = await fetch(`${API_URL}/api/Revision/historial`, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });

    return handleResponse<Revision[]>(response, 'Error al cargar revisiones');
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, 'Error de conexión con el servidor');
  }
}

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

export function guardarMaterialesFaltantes(materiales: MaterialFaltante[]): void {
  localStorage.setItem('materialesFaltantes', JSON.stringify(materiales));
}

export function getMaterialesFaltantes(): MaterialFaltante[] | null {
  const materiales = localStorage.getItem('materialesFaltantes');
  return materiales ? JSON.parse(materiales) : null;
}

export function limpiarDatosRevision(): void {
  const keysToRemove = ['materialesFaltantes', 'ambulanciaSeleccionada', 'servicioSeleccionado', 'nombreResponsable'];
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

// Reposiciones

export async function guardarReposicion(reposicion: Reposicion): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new ApiError(401, 'No hay token de autenticación');

  const response = await fetch(`${API_URL}/api/Reposicion`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(reposicion)
  });

  if (!response.ok) throw new Error('Error al guardar en backend');
  return response.json();
}

export async function getHistorialReposiciones(): Promise<ReposicionDetalle[]> {
  const token = getAuthToken();
  if (!token) throw new ApiError(401, 'No hay token de autenticación');

  try {
    const response = await fetch(`${API_URL}/api/Reposicion/historial`, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });

    if (response.ok) return response.json();

    // Fallback a localStorage
    return JSON.parse(localStorage.getItem('historialReposiciones') || '[]');
  } catch {
    return JSON.parse(localStorage.getItem('historialReposiciones') || '[]');
  }
}

export async function getReposicionById(id: number): Promise<ReposicionDetalle | null> {
  const token = getAuthToken();
  if (!token) throw new ApiError(401, 'No hay token de autenticación');

  try {
    const response = await fetch(`${API_URL}/api/Reposicion/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });

    if (response.ok) return response.json();
  } catch {
    // Fallback a localStorage
  }

  const historial = JSON.parse(localStorage.getItem('historialReposiciones') || '[]');
  return historial.find((r: any) => r.id == id || r.idReposicion == id) || null;
}

export async function confirmarReposicion(id: number, materiales: any[]): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new ApiError(401, 'No hay token de autenticación');

  try {
    const datosReposicion = {
      idReposicion: id,
      materiales: materiales,
      estado: 'completada'
    };

    const response = await fetch(`${API_URL}/api/Reposicion/${id}/confirmar`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(datosReposicion)
    });

    if (!response.ok) throw new ApiError(response.status, 'Error al confirmar reposición');
  } catch {
    // Fallback a localStorage
    let historial = JSON.parse(localStorage.getItem('historialReposiciones') || '[]');
    const index = historial.findIndex((r: any) => r.id == id || r.idReposicion == id);

    if (index !== -1) {
      historial[index].estado = 'completada';
      historial[index].materialesRepuestos = materiales;
      localStorage.setItem('historialReposiciones', JSON.stringify(historial));
    }
  }
}

export function guardarReposicionEnHistorial(reposicion: Reposicion): void {
  let historial = JSON.parse(localStorage.getItem('historialReposiciones') || '[]');
  historial.push(reposicion);
  localStorage.setItem('historialReposiciones', JSON.stringify(historial));
}

export function saveReposicionData(data: ReposicionData): void {
  localStorage.setItem('reposicionData', JSON.stringify(data));
}

export function getReposicionData(): ReposicionData | null {
  const data = localStorage.getItem('reposicionData');
  return data ? JSON.parse(data) : null;
}

export function clearReposicionData(): void {
  localStorage.removeItem('reposicionData');
}

export function updateReposicionData(comentarios: string, fotos: FotoSeleccionada[]): void {
  const data = getReposicionData();
  if (data) {
    const completaData: ReposicionCompletaData = { ...data, comentarios, fotos };
    localStorage.setItem('reposicionData', JSON.stringify(completaData));
  }
}

export function limpiarDatosReposicion(): void {
  const keysToRemove = ['ambulanciaSeleccionada', 'servicioSeleccionado', 'nombreResponsable', 'reposicionData'];
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

// Usuarios/Responsables

export async function getUsuarios(): Promise<UsuarioResponsable[]> {
  const token = getAuthToken();
  if (!token) throw new ApiError(401, 'No hay token de autenticación');

  const response = await fetch(`${API_URL}/api/Usuario`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });

  return handleResponse<UsuarioResponsable[]>(response, 'Error al cargar usuarios');
}

export async function getUsuarioById(id: number): Promise<UsuarioResponsable> {
  const token = getAuthToken();
  if (!token) throw new ApiError(401, 'No hay token de autenticación');

  const response = await fetch(`${API_URL}/api/Usuario/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });

  return handleResponse<UsuarioResponsable>(response, 'Error al cargar usuario');
}

export async function crearUsuario(usuario: UsuarioResponsable): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new ApiError(401, 'No hay token de autenticación');

  const response = await fetch(`${API_URL}/api/Usuario`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(usuario)
  });

  return handleResponse(response, 'Error al crear usuario');
}

export async function actualizarUsuario(id: number, usuario: Partial<UsuarioResponsable>): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new ApiError(401, 'No hay token de autenticación');

  const response = await fetch(`${API_URL}/api/Usuario/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(usuario)
  });

  return handleResponse(response, 'Error al actualizar usuario');
}

export async function eliminarUsuario(id: number): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new ApiError(401, 'No hay token de autenticación');

  const response = await fetch(`${API_URL}/api/Usuario/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });

  if (!response.ok) throw new ApiError(response.status, 'Error al eliminar usuario');
}

// Utilidades

export function saveNombreResponsable(nombre: string): void {
  localStorage.setItem('nombreResponsable', nombre);
}

export function getNombreResponsable(): string | null {
  return localStorage.getItem('nombreResponsable');
}

export function formatearFecha(fechaISO: string): string {
  const fecha = new Date(fechaISO);
  const dia = fecha.getDate();
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const mes = meses[fecha.getMonth()];
  const año = fecha.getFullYear();
  return `${dia} ${mes} ${año}`;
}

export function formatearFechaLarga(fechaISO: string): string {
  const fecha = new Date(fechaISO);
  const dia = fecha.getDate();
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const mes = meses[fecha.getMonth()];
  const año = fecha.getFullYear();
  return `${dia} de ${mes}, ${año}`;
}

export function obtenerEstadoReposicion(reposicion: any): { texto: string; clase: string } {
  if (reposicion.estado) {
    const estadoLower = reposicion.estado.toLowerCase();
    const estados: Record<string, { texto: string; clase: string }> = {
      'completada': { texto: 'completada', clase: 'completada' },
      'completado': { texto: 'completada', clase: 'completada' },
      'pendiente': { texto: 'Pendiente', clase: 'pendiente' },
      'sin-realizar': { texto: 'Sin realizar', clase: 'sin-realizar' },
      'urgente': { texto: 'Urgente', clase: 'urgente' }
    };
    
    if (estados[estadoLower]) return estados[estadoLower];
  }

  return { texto: 'Pendiente', clase: 'pendiente' };
}

export function obtenerEstadoRevision(revision: Revision): { texto: string; clase: string } {
  if (revision.estado) {
    const estadoLower = revision.estado.toLowerCase();
    const estados: Record<string, { texto: string; clase: string }> = {
      'completada': { texto: 'completada', clase: 'completada' },
      'pendiente': { texto: 'Pendiente', clase: 'pendiente' },
      'urgente': { texto: 'Urgente', clase: 'urgente' },
      'sin-realizar': { texto: 'Pendiente', clase: 'sin-realizar' }
    };
    
    if (estados[estadoLower]) return estados[estadoLower];
  }

  if (revision.totalMateriales && revision.materialesRevisados !== undefined) {
    const porcentaje = (revision.materialesRevisados / revision.totalMateriales) * 100;
    if (porcentaje === 100) return { texto: 'completada', clase: 'completada' };
    if (porcentaje > 0) return { texto: 'Pendiente', clase: 'pendiente' };
    return { texto: 'Pendiente', clase: 'sin-realizar' };
  }

  return { texto: 'completada', clase: 'completada' };
}
