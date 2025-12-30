-- ============================================
-- Inserts adicionales para pruebas en Swagger
-- ============================================

USE AmbustockDB;
GO

-- =============================================
-- USUARIOS
-- =============================================
INSERT INTO usuarios (Nombre_Usuario, Rol, email, Password) VALUES
('Admin Usuario', 'Administrador', 'admin@ambustock.com', '123456'),
('Juan Pérez', 'Médico', 'juan.perez@ambustock.com', '123456'),
('María García', 'Enfermera', 'maria.garcia@ambustock.com', '123456'),
('Carlos López', 'Conductor', 'carlos.lopez@ambustock.com', '123456');

-- =============================================
-- RESPONSABLES
-- =============================================
INSERT INTO responsable (Nombre_Responsable, Fecha_Servicio) VALUES
('Dr. Antonio Martínez', '2025-12-29 08:00:00'),
('Dra. Laura Sánchez', '2025-12-29 14:00:00'),
('Enf. Pedro Ruiz', '2025-12-28 10:30:00');

-- =============================================
-- SERVICIOS
-- =============================================
INSERT INTO servicio (fecha_hora, nombre_servicio, Id_responsable) VALUES
('2025-12-29 08:30:00', 'Emergencia Cardiaca - Calle Mayor 23', 1),
('2025-12-29 09:15:00', 'Accidente Tráfico - Autopista A2 km 15', 2),
('2025-12-29 10:00:00', 'Traslado Hospital - Paciente UCI', 1),
('2025-12-28 15:45:00', 'Atención Domiciliaria - Barrio Las Fuentes', 3),
('2025-12-28 20:30:00', 'Emergencia Respiratoria - Plaza España', 2);

-- =============================================
-- SERVICIO_AMBULANCIA (relación ambulancia-servicio)
-- =============================================
INSERT INTO Servicio_Ambulancia (Id_Ambulancia, Id_Servicio) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5);

-- =============================================
-- CORREOS (alertas de materiales)
-- =============================================
INSERT INTO correo (fecha_alerta, tipo_problema, Id_material, Id_usuario) VALUES
('2025-12-29 08:00:00', 'Stock bajo - Adrenalina', 2, 2),
('2025-12-29 09:30:00', 'Material caducado - Atropina', 4, 3),
('2025-12-28 16:00:00', 'Stock crítico - Morfina', 303, 2),
('2025-12-28 18:45:00', 'Falta material - Tubo traqueal 7mm', 703, 1),
('2025-12-29 07:00:00', 'Stock bajo - Paracetamol 1g', 21, 3);

-- =============================================
-- REPOSICIONES
-- =============================================
INSERT INTO Reposicion (Id_Correo, Nombre_material, Cantidad, Comentarios) VALUES
(1, 'Adrenalina (Epinefrina) 1mg amp', 10, 'Reposición urgente solicitada'),
(2, 'Atropina 1mg amp', 5, 'Revisar fecha de caducidad del nuevo lote'),
(3, 'Morfina (Cloruro morfico)', 3, 'Material controlado - requiere firma'),
(4, 'Tubo traqueal 7mm', 2, 'Pedido realizado al proveedor'),
(5, 'Paracetamol 1g comprimidos', 20, 'Reposición mensual');

-- =============================================
-- DETALLE_CORREO (relación correo-material)
-- =============================================
INSERT INTO Detalle_Correo (Id_material, Id_correo) VALUES
(2, 1),    -- Adrenalina en correo 1
(4, 2),    -- Atropina en correo 2
(303, 3),  -- Morfina en correo 3
(703, 4),  -- Tubo traqueal en correo 4
(21, 5);   -- Paracetamol en correo 5

-- =============================================
-- Actualizar relaciones adicionales
-- =============================================

-- Actualizar correos con reposiciones
UPDATE correo SET Id_reposicion = 1 WHERE Id_Correo = 1;
UPDATE correo SET Id_reposicion = 2 WHERE Id_Correo = 2;
UPDATE correo SET Id_reposicion = 3 WHERE Id_Correo = 3;
UPDATE correo SET Id_reposicion = 4 WHERE Id_Correo = 4;
UPDATE correo SET Id_reposicion = 5 WHERE Id_Correo = 5;

-- Actualizar responsables con servicios y usuarios
UPDATE responsable SET Id_servicio = 1, Id_usuario = 2 WHERE Id_responsable = 1;
UPDATE responsable SET Id_servicio = 2, Id_usuario = 3 WHERE Id_responsable = 2;
UPDATE responsable SET Id_servicio = 4, Id_usuario = 4 WHERE Id_responsable = 3;

-- Actualizar servicios con responsables
UPDATE servicio SET Id_responsable = 1 WHERE Id_servicio IN (1, 3);
UPDATE servicio SET Id_responsable = 2 WHERE Id_servicio IN (2, 5);
UPDATE servicio SET Id_responsable = 3 WHERE Id_servicio = 4;

-- Actualizar responsables con reposiciones
UPDATE responsable SET Id_Reposicion = 1 WHERE Id_responsable = 1;
UPDATE responsable SET Id_Reposicion = 3 WHERE Id_responsable = 2;

-- Actualizar algunos usuarios con responsables
UPDATE usuarios SET Id_responsable = 1 WHERE Id_usuario = 2;
UPDATE usuarios SET Id_responsable = 2 WHERE Id_usuario = 3;

-- Actualizar algunos usuarios con correos
UPDATE usuarios SET Id_Correo = 1 WHERE Id_usuario = 2;
UPDATE usuarios SET Id_Correo = 3 WHERE Id_usuario = 3;

-- =============================================
-- Verificación de datos insertados
-- =============================================

-- Ver estadísticas
SELECT 
    'Ambulancias' as Tabla, COUNT(*) as Total FROM ambulancia
UNION ALL
SELECT 'Zonas', COUNT(*) FROM zonas
UNION ALL
SELECT 'Cajones', COUNT(*) FROM cajones
UNION ALL
SELECT 'Materiales', COUNT(*) FROM materiales
UNION ALL
SELECT 'Usuarios', COUNT(*) FROM usuarios
UNION ALL
SELECT 'Responsables', COUNT(*) FROM responsable
UNION ALL
SELECT 'Servicios', COUNT(*) FROM servicio
UNION ALL
SELECT 'ServicioAmbulancia', COUNT(*) FROM Servicio_Ambulancia
UNION ALL
SELECT 'Correos', COUNT(*) FROM correo
UNION ALL
SELECT 'Reposiciones', COUNT(*) FROM Reposicion
UNION ALL
SELECT 'DetalleCorreo', COUNT(*) FROM Detalle_Correo;

-- Ver materiales con stock bajo (<=2)
SELECT 
    m.Id_material,
    m.nombre_Producto,
    m.cantidad,
    z.nombre_zona,
    c.Nombre_cajon
FROM materiales m
INNER JOIN zonas z ON m.Id_zona = z.ID_zona
LEFT JOIN cajones c ON m.Id_cajon = c.Id_cajon
WHERE m.cantidad <= 2
ORDER BY m.cantidad ASC;

-- Ver correos con sus materiales
SELECT 
    c.Id_Correo,
    c.fecha_alerta,
    c.tipo_problema,
    m.nombre_Producto,
    u.Nombre_Usuario,
    r.Comentarios as ComentariosReposicion
FROM correo c
LEFT JOIN materiales m ON c.Id_material = m.Id_material
LEFT JOIN usuarios u ON c.Id_usuario = u.Id_usuario
LEFT JOIN Reposicion r ON c.Id_reposicion = r.id_reposicion
ORDER BY c.fecha_alerta DESC;

-- Ver servicios realizados
SELECT 
    s.Id_servicio,
    s.fecha_hora,
    s.nombre_servicio,
    r.Nombre_Responsable,
    a.Nombre as Ambulancia,
    a.Matricula
FROM servicio s
LEFT JOIN responsable r ON s.Id_responsable = r.Id_responsable
LEFT JOIN Servicio_Ambulancia sa ON s.Id_servicio = sa.Id_Servicio
LEFT JOIN ambulancia a ON sa.Id_Ambulancia = a.Id_ambulancia
ORDER BY s.fecha_hora DESC;
