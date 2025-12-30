-- ============================================
-- Script de inserción de datos para AmbustockDB
-- ============================================

USE AmbustockDB;

-- 1) Ambulancia
INSERT INTO ambulancia (Nombre, Matricula)
VALUES ('Ambulancia UVI Movil AM50.2-Z', '2345-XYZ');

-- 2) Zona
INSERT INTO zonas (nombre_zona, Id_ambulancia)
VALUES ('AMPULARIO MEDICO', 1);

-- 3) Materiales (asignados a zona 1 y sin cajón: Id_cajon = NULL)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Adolonta (Tramadol Hidrocloruro)', 1, 1, NULL),
('Adrenalina (Epinefrina)', 0, 1, NULL),
('Anexate', 0, 1, NULL),
('Atropina', 2, 1, NULL),
('Actocortina 100 mg', 1, 1, NULL),
('Benerva (Tiamina)', 1, 1, NULL),
('Dormicum (Midazolam)', 0, 1, NULL),
('Enantyum (Dexketoprofeno)', 1, 1, NULL),
('Naloxona', 2, 1, NULL),
('Nolotil (Metamizol)', 1, 1, NULL),
('Polaramire (Dexclorferinamina)', 1, 1, NULL),
('Primperam (Metoclopramida)', 2, 1, NULL),
('Seguril (Furosemida)', 2, 1, NULL),
('Trangorex (Amiodarona)', 0, 1, NULL),
('Urbason 20mg (Metilprednisolona)', 1, 1, NULL),
('Urbason 40mg (Metilprednisolona)', 1, 1, NULL),
('Trandate 5 mg (Labetalol hidrocloruro)', 0, 1, NULL),
('Solinitrina 5 mg (Nitroglicerina)', 1, 1, NULL),
('Akineton (Biperideno)', 1, 1, NULL),
('Amchafibrin 500mg (Acido Tranesamico)', 2, 1, NULL),
('Paracetamol 1g', 4, 1, NULL),
('Valium compr. 5mg', 2, 1, NULL),
('Metamizol comp.', 2, 1, NULL),
('Clopidogrel 300 mg', 2, 1, NULL),
('AAS 500 mg', 10, 1, NULL),
('Captopril 25 mg', 10, 1, NULL),
('Orfidal 1mg', 18, 1, NULL),
('Digoxina 0,25 mg', 1, 1, NULL),
('Dogmatil 50mg', 1, 1, NULL),
('Dopamina 200mg', 1, 1, NULL),
('Haloperidol', 1, 1, NULL),
('Adenocor 6mg (Adenosina)', 2, 1, NULL),
('Agua oxigenada', 1, 1, NULL),
('Alcohol', 1, 1, NULL),
('Suero 30ml', 2, 1, NULL),
('Povidona (yodo)', 1, 1, NULL),
('Clorehixidina', 1, 1, NULL),
('Agujas 21G', 6, 1, NULL),
('Agujas 25G', 5, 1, NULL),
('Agujas 20G', 5, 1, NULL),
('Suero fisiologico 500ml', 1, 1, NULL),
('Suero fisiologico 100 ml', 1, 1, NULL),
('Glucosado 5% 50ml', 2, 1, NULL),
('Venda crepe 7x4', 1, 1, NULL),
('Venda crepe 5x4', 1, 1, NULL),
('Venda crepe 10x10', 1, 1, NULL),
('Venda cohesiva 6x4', 1, 1, NULL),
('Venda cohesiva 10x4', 1, 1, NULL),
('Jeringas 2ml', 4, 1, NULL),
('Jeringas 5ml', 4, 1, NULL),
('Jeringas 10ml', 2, 1, NULL),
('Jeringas 20ml', 3, 1, NULL),
('Paracetamol 100ml IV', 1, 1, NULL),
('Adrenalina inyectable', 0, 1, NULL),
('Aguja 21G Adrenalina', 1, 1, NULL),
('Intraosea', 1, 1, NULL),
('Llave 3 vias', 3, 1, NULL),
('Regulador de flujo', 2, 1, NULL),
('Equipo suero 3 vias', 0, 1, NULL),
('Equipo suero', 1, 1, NULL),
('TRINYSPRAY', 1, 1, NULL),
('LIDOCAINA', 0, 1, NULL),
('SUPLECAL', 0, 1, NULL),
('OMEPRAZOL 40MG', 0, 1, NULL);
