-- ============================================
-- Script de inserción - Zona MORFICOS
-- ============================================

USE AmbustockDB;

-- 2) Zona MORFICOS
INSERT INTO zonas (nombre_zona, Id_ambulancia)
VALUES ('MORFICOS', 1);

-- 3) Materiales de la zona MORFICOS
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Adolonta 100mg amp (Tramadol Hidrocloruro)', 3, 4, NULL),
('Fentanest (Fentanilo)', 2, 4, NULL),
('Morfina (Cloruro morfico)', 2, 4, NULL),
('Propofol (Propofol)', 0, 4, NULL),
('Dolantina', 2, 4, NULL),
('Ventolin 0,5 mg', 0, 4, NULL),
('Adrenalina precargada', 0, 4, NULL),
('Suero fisiologico 10 ml', 6, 4, NULL),
('Agujas verdes', 4, 4, NULL),
('Agujas amarillas', 5, 4, NULL),
('Agujas naranjas', 8, 4, NULL);
