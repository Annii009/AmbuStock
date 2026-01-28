-- ============================================
-- Script de inserción - Zona BOTIQUIN PEDIATRICO
-- ============================================

USE AmbustockDB;

-- 2) Zona BOTIQUIN PEDIATRICO
INSERT INTO zonas (nombre_zona, Id_ambulancia)
VALUES ('BOTIQUIN PEDIATRICO', 1);

-- 3) Materiales del botiquín pediátrico
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Mascarilla laringea 2,5', 1, 6, NULL),
('Mascarilla laringea 2', 1, 6, NULL),
('Mascarilla laringea 1,5', 1, 6, NULL),
('Mascarilla laringea 1', 0, 6, NULL),
('Guedel 1', 1, 6, NULL),
('Gasa 20x20', 2, 6, NULL),
('Talla esteril 75x90 cm', 1, 6, NULL),
('Tubo traqueal 3.0', 1, 6, NULL),
('Tubo traqueal 3.5', 1, 6, NULL),
('Tubo traqueal con balón 4', 1, 6, NULL),
('Tubo traqueal con balón 4.5', 1, 6, NULL),
('Tubo traqueal con balón 5', 1, 6, NULL),
('Jeringa 10 ml', 1, 6, NULL),
('Venda gasa 10 cm', 2, 6, NULL),
('Pinza maguill', 1, 6, NULL),
('Pinza pequeña', 1, 6, NULL),
('Gel lubricante', 1, 6, NULL),
('Silkospray', 1, 6, NULL),
('Guia intubar 2.0', 1, 6, NULL),
('Guia intubar 4.8', 1, 6, NULL),
('Equipo laringo completo', 1, 6, NULL),
('Smart', 2, 6, NULL),
('Palometa 21G', 1, 6, NULL),
('Palometa 23G', 1, 6, NULL),
('Venda cohesiva 10 cm', 1, 6, NULL),
('Cateter 22G', 3, 6, NULL),
('Cateter 24G', 2, 6, NULL),
('Intraosea', 1, 6, NULL),
('Aposito cateter', 2, 6, NULL),
('Gasas 20x20', 4, 6, NULL),
('Clorhexidina 1%', 1, 6, NULL),
('Jeringa insulina', 2, 6, NULL),
('Jeringa 2 ml', 4, 6, NULL),
('Jeringa 5 ml', 2, 6, NULL),
('Jeringa 10 ml', 3, 6, NULL),
('Jeringa 20 ml', 1, 6, NULL),
('Gafas nasales', 1, 6, NULL),
('Mascarilla reservorio', 1, 6, NULL),
('Mascarilla flujo', 1, 6, NULL),
('Mascarilla hudson', 0, 6, NULL);
