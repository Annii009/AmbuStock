-- ============================================
-- Script de inserción - Zona BOTIQUIN RESPIRATORIO ADULTO
-- ============================================

USE AmbustockDB;

-- 2) Zona BOTIQUIN RESPIRATORIO ADULTO
INSERT INTO zonas (nombre_zona, Id_ambulancia)
VALUES ('BOTIQUIN RESPIRATORIO ADULTO', 1);

-- 3) Materiales del botiquín respiratorio adulto
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Tubo traqueal 6mm', 1, 8, NULL),
('Tubo traqueal 6,5 mm', 1, 8, NULL),
('Tubo traqueal 7mm', 1, 8, NULL),
('Tubo traqueal 7,5mm', 1, 8, NULL),
('Tubo traqueal 8mm', 1, 8, NULL),
('Tubo traqueal 8,5mm', 1, 8, NULL),
('Tubo traqueal 9mm', 1, 8, NULL),
('Guia intubación 4,8', 1, 8, NULL),
('Talla esteril 75x90', 1, 8, NULL),
('Pinza Magil', 1, 8, NULL),
('Kit Laringo completo', 1, 8, NULL),
('Filtro', 1, 8, NULL),
('Lubricante gel', 1, 8, NULL),
('Silko spray', 1, 8, NULL),
('Ventolin', 1, 8, NULL),
('Atrovent', 1, 8, NULL),
('Salbutamol para nebulizador', 1, 8, NULL),
('Mascarilla reservorio', 2, 8, NULL),
('Gafas nasales', 1, 8, NULL),
('Mascarilla flujo', 2, 8, NULL),
('Mascarilla nebulizador', 0, 8, NULL),
('Mascarilla laringea 3', 1, 8, NULL),
('Mascarilla laringea 4', 1, 8, NULL),
('Mascarilla laringea 5', 1, 8, NULL),
('Tijera corte', 1, 8, NULL),
('Compresa 10x20', 2, 8, NULL),
('Jeringa 20 ml', 0, 8, NULL),
('Guedel 9', 1, 8, NULL),
('Guedel 10', 1, 8, NULL),
('Guedel 12', 1, 8, NULL),
('Guantes esteril S', 2, 8, NULL),
('Guantes esteril M', 2, 8, NULL),
('Guantes esteril L', 2, 8, NULL),
('Talla esteril 75x90 (extra)', 1, 8, NULL),
('Llave 3 vias', 1, 8, NULL),
('Cateter 14G', 2, 8, NULL),
('Canula puncion pneunocath', 1, 8, NULL),
('Seda 2/0', 1, 8, NULL),
('Seda 3/0', 1, 8, NULL),
('Pneunovent tubo conexión', 1, 8, NULL),
('Pinza Kochez', 1, 8, NULL),
('Pinza normal', 1, 8, NULL);
