-- 1) SERVICIO
INSERT INTO servicio (fecha_hora, nombre_servicio)
VALUES
    ('2026-01-01 08:30:00', N'Urgencia trauma'),
    ('2026-01-01 12:15:00', N'Transporte programado'),
    ('2026-01-02 03:45:00', N'Urgencia cardiaca');

-- 2) RESPONSABLE (sin FKs)
INSERT INTO responsable (Nombre_Responsable, Fecha_Servicio)
VALUES
    (N'Juan Pérez', '2026-01-01 08:30:00'),
    (N'Ana Gómez', '2026-01-01 12:15:00'),
    (N'Luis Martínez', '2026-01-02 03:45:00');

-- 3) USUARIOS (sin Id_responsable ni Id_Correo)
INSERT INTO usuarios (Nombre_Usuario, Rol, email, Password)
VALUES
    (N'admin', N'Administrador', N'admin@ambustock.local', N'Admin123!'),
    (N'jefe_guardia', N'Supervisor', N'jefe.guardias@ambustock.local', N'Super123!'),
    (N'operador1', N'Operador', N'operador1@ambustock.local', N'Oper123!');

-- 4) VINCULAR SERVICIO <-> RESPONSABLE (asumiendo IDs 1..3)
UPDATE servicio SET Id_responsable = 1 WHERE Id_servicio = 1;
UPDATE servicio SET Id_responsable = 2 WHERE Id_servicio = 2;
UPDATE servicio SET Id_responsable = 3 WHERE Id_servicio = 3;

UPDATE responsable SET Id_servicio = 1 WHERE Id_responsable = 1;
UPDATE responsable SET Id_servicio = 2 WHERE Id_responsable = 2;
UPDATE responsable SET Id_servicio = 3 WHERE Id_responsable = 3;

-- 5) SERVICIO_AMBULANCIA
-- solo existe Id_ambulancia = 1, así que todo a 1
INSERT INTO Servicio_Ambulancia (Id_Ambulancia, Id_Servicio)
VALUES
    (1, 1),
    (1, 2),
    (1, 3);

-- 6) CORREO (crea primero los correos)
INSERT INTO correo (fecha_alerta, tipo_problema, Id_material, Id_usuario)
VALUES
    ('2026-01-01 09:00:00', N'Nivel bajo de suero fisiológico', 1, 1),
    ('2026-01-01 13:00:00', N'Faltan guantes talla M', 2, 3),
    ('2026-01-02 04:00:00', N'Caducidad próxima de medicación', 3, 2);

-- comprueba los Id_Correo asignados:
-- SELECT Id_Correo, fecha_alerta, tipo_problema FROM correo;

-- 7) DETALLE_CORREO (si los correos quedaron con IDs 1,2,3)
INSERT INTO Detalle_Correo (Id_material, Id_correo)
VALUES
    (1, 1),
    (2, 2),
    (3, 3);

-- 8) REPOSICION (mismo supuesto: correos 1,2,3)
INSERT INTO Reposicion (Id_Correo, Nombre_material, Cantidad, Comentarios, foto_evidencia)
VALUES
    (1, N'Suero fisiológico 500ml', 10, N'Repuesto stock mínimo en cajón 1', NULL),
    (2, N'Guantes nitrilo talla M', 50, N'Reposición estándar fin de guardia', NULL),
    (3, N'Adrenalina 1mg/ml', 5, N'Revisión caducidad y reposición', NULL);

-- comprueba IDs:
-- SELECT * FROM Reposicion;

-- 9) VINCULAR RESPONSABLE -> USUARIO / REPOSICION
UPDATE responsable
SET Id_usuario = 2, Id_Reposicion = 1
WHERE Id_responsable = 1;

UPDATE responsable
SET Id_usuario = 1, Id_Reposicion = 2
WHERE Id_responsable = 2;

UPDATE responsable
SET Id_usuario = 3, Id_Reposicion = 3
WHERE Id_responsable = 3;

-- 10) VINCULAR USUARIOS -> RESPONSABLE
UPDATE usuarios SET Id_responsable = 1 WHERE Id_usuario = 1;
UPDATE usuarios SET Id_responsable = 2 WHERE Id_usuario = 2;
UPDATE usuarios SET Id_responsable = 3 WHERE Id_usuario = 3;

-- 11) VINCULAR USUARIOS -> CORREO
UPDATE usuarios SET Id_Correo = 1 WHERE Id_usuario = 1;
UPDATE usuarios SET Id_Correo = 2 WHERE Id_usuario = 2;
UPDATE usuarios SET Id_Correo = 3 WHERE Id_usuario = 3;

-- 12) VINCULAR CORREO -> REPOSICION
UPDATE correo SET Id_reposicion = 1 WHERE Id_Correo = 1;
UPDATE correo SET Id_reposicion = 2 WHERE Id_Correo = 2;
UPDATE correo SET Id_reposicion = 3 WHERE Id_Correo = 3;
