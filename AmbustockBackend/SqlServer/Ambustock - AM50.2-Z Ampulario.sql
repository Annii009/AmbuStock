-- ============================================
-- Script de inserción - Zona AMPULARIO
-- ============================================

USE AmbustockDB;

-- 2) Nueva zona para este listado
INSERT INTO zonas (nombre_zona, Id_ambulancia)
VALUES ('AMPULARIO', 1);

-- 3) Materiales para zona 2 (sin cajón específico)
INSERT INTO materiales (nombre_Producto, cantidad, Id_zona, Id_cajon) VALUES
('Actocortina 100mg vial (Hidrocortisona 100mg)', 1, 2, NULL),
('Actocortina 500mg vial (Hidrocortisona 500mg)', 0, 2, NULL),
('Adenocor (Adenosina 6mg vial)', 6, 2, NULL),
('Adrenalina amp (Epinefrina 1mg amp)', 10, 2, NULL),
('Akineton (Biperideno clorhidrato 5mg amp)', 4, 2, NULL),
('Aleudrina amp (Isoprenalina 0,2mg amp)', 0, 2, NULL),
('Amchafibrin 500mg amp (Acido tranxemico 500mg amp)', 4, 2, NULL),
('Anexate 0,5mg amp (Flumazenilo 0,5mg amp)', 3, 2, NULL),
('Atropina 1mg amp', 6, 2, NULL),
('Atrovent 500mcg amp (Bromuro ipatropico 500mcg)', 2, 2, NULL),
('Benerva amp (Tiamina 100mg amp)', 3, 2, NULL),
('Buscapina (Butilescopolamina bromuro amp)', 1, 2, NULL),
('Clexane 80mg amp (Enoxaparina 80mg amp)', 0, 2, NULL),
('Cloruro potasico 2 M amp (Cloruropotasico 2 M amp)', 2, 2, NULL),
('Diclofenac amp (Diclofenaco sodico 75mg amp)', 3, 2, NULL),
('Digoxina amp (Digoxina 0,25mg amp)', 3, 2, NULL),
('Dobutamina amp (Dobutamina 250mg amp)', 2, 2, NULL),
('Dogmatil amp (Sulpiride 100mg amp)', 3, 2, NULL),
('Dopamina 200mg amp (Dopamina 200mg)', 1, 2, NULL),
('Dormicun 5mg/3ml amp (Midazolam 5mg/3ml amp)', 2, 2, NULL),
('Enantyum amp (Dexketoprofeno amp)', 1, 2, NULL),
('Esmolol amp (Esmolol 100mg/10ml amp)', 2, 2, NULL),
('Fortecortin amp 4mg', 2, 2, NULL),
('Haloperidol 5mg amp', 4, 2, NULL),
('Hypnomidate amp (Etomidato 20mg)', 2, 2, NULL),
('Inyesprin (Acetil salicilato de lisina 900mg)', 0, 2, NULL),
('Kepra amp (Levetiracetam 100mg/ml)', 0, 2, NULL),
('Ketolar vial (Ketamina 50mg vial)', 1, 2, NULL),
('Lidocaina 5% vial', 2, 2, NULL),
('Mepivacaina 2% 5ml', 2, 2, NULL),
('Naloxona amp (Naloxona 0,4mg amp)', 3, 2, NULL),
('Nolotil amp (Metamizol 2g)', 1, 2, NULL),
('Norepinefrina 4ml amp (Norepinefrina amp)', 1, 2, NULL),
('Paracetamol supositorio', 0, 2, NULL),
('Polaramire amp (Dexclorfenamina 5mg amp)', 3, 2, NULL),
('Primperam amp (Metoclopramida 100mg)', 2, 2, NULL),
('Pulmicort (Budesonida 0,5mg vial)', 2, 2, NULL),
('Rivotril amp (Clonazepam 1mg)', 2, 2, NULL),
('Salbuair vial (Salbutamol 5mg/2,5ml)', 2, 2, NULL),
('Seguril amp (Furosemida 20mg)', 2, 2, NULL),
('Solinitrina fuerte amp (Nitroglicerina 50mg/5ml amp)', 3, 2, NULL),
('Solumoderin 1g vial (Metilprednisolona succinato 1g)', 1, 2, NULL),
('Stesolid 5mg microenema (Diazepam 5mg microenema)', 1, 2, NULL),
('Suplecal 10ml amp (Gluconato calcico 10ml)', 0, 2, NULL),
('Tinispray (Nitroglicerina 400mcg spray)', 2, 2, NULL),
('Toradol amp (Ketorolaco 50mg vial)', 4, 2, NULL),
('Trandate amp (Labetalol 100mg amp)', 0, 2, NULL),
('Trangorex (Amiodarona 150mg amp)', 1, 2, NULL),
('Tranxilium 20mg amp (Clorazepato dipotasico 20mg vial)', 0, 2, NULL),
('Urapidilo amp (Urapidilo 50mg amp)', 2, 2, NULL),
('Urbason 20mg amp (Metil prednisolona 20mg amp)', 4, 2, NULL),
('Urbason 40mg amp (Metil prednisolona 40mg amp)', 3, 2, NULL),
('Valium 10mg amp (Diazepam 10mg amp)', 4, 2, NULL),
('Ventolin amp (Salbutamol 500mcg amp)', 1, 2, NULL),
('Zantac 50mg amp (Ranitidina 50mg amp)', 0, 2, NULL),
('Omeoprazol ampolla', 0, 2, NULL);
