export interface AuthRequestDTO {
    username: string;
    password: string;
}

export interface UserResponseDTO {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    correo: string; // Alias para compatibilidad con componentes existentes
    rol: string;
    token: string;
}

export interface HabitacionDetalleDTO {
    id: number;
    codigo: string;
    estado: string;
    tipoNombre: string;
    descripcion: string;
    precio: number;
    capacidad: number;
    imagenUrl: string;
    amenities: string;
}

export interface ReservaDetalleDTO {
    id: number;
    fechaInicio: string;
    fechaFin: string;
    cantidadPersonas: number;
    estado: string;
    habitacionCodigo: string;
    habitacionTipo: string;
    precioNoche: number;
    huespedNombreCompleto: string;
    totalCuenta: number;
}

export interface ItemFacturaDTO {
    servicioNombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface FacturaResumenDTO {
    reservaId: number;
    huespedNombre: string;
    habitacionCodigo: string;
    fechaInicio: string;
    fechaFin: string;
    noches: number;
    precioNoche: number;
    subtotalHabitacion: number;
    itemsServicios: ItemFacturaDTO[];
    subtotalServicios: number;
    totalGeneral: number;
    estadoReserva: string;
}