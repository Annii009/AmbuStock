-- ============================================
-- Script de inserción - Zona NEVERA
-- ============================================

USE AmbustockDB;

-- 2) Zona NEVERA
INSERT INTO zonas (nombre_zona, Id_ambulancia)
VALUES ('NEVERA', 1);

-- 3) Materiales en la NEVERA
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Actrapid -NOVO RAPID- (Insulina)', 1, 5, NULL),
('Anectine (Suxametonio 100mg/2ml)', 0, 5, NULL),
('Nimbex (Cisatracurio 2mg/ml)', 2, 5, NULL),
('Glucagen (Insulina rapida)', 2, 5, NULL),
('Rocuronio', 2, 5, NULL),
('Agujas insulina', 1, 5, NULL),
('Suero fisiologico 500 ml', 1, 5, NULL);
