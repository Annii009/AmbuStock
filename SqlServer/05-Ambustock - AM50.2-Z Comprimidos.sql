-- ============================================
-- Script de inserción - Zona COMPRIMIDOS
-- ============================================

USE AmbustockDB;

-- 2) Zona COMPRIMIDOS
INSERT INTO zonas (nombre_zona, Id_ambulancia)
VALUES ('COMPRIMIDOS', 1);

-- 3) Materiales COMPRIMIDOS para zona 3
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Cafinitrina (Cafinitrina)', 10, 3, NULL),
('Ibuprofeno 600mg (Ibuprofeno 600mg)', 10, 3, NULL),
('Paracetamol 1mg (Paracetamol 1g)', 5, 3, NULL),
('Enantyum (Dexketoprofeno 25mg)', 3, 3, NULL),
('Orfidal (Lorazepam 1mg)', 1, 3, NULL),
('Nolotil (Metamizol magnesico, 1 blister)', 0, 3, NULL),
('Valium (Diazepam 5mg)', 4, 3, NULL),
('Clopidrogel 75 mg (Clopidrogel 100mg)', 4, 3, NULL),
('Clopidrogel 300 (Clopidrogel 300mg)', 4, 3, NULL),
('Aspirina (A.A.S. 500mg, 1 blister)', 0, 3, NULL),
('Captopril 25 mg.', 8, 3, NULL),
('Fortocortin 1 mg', 4, 3, NULL),
('Adiro', 15, 3, NULL),
('Aspirina 100 mg', 6, 3, NULL);
