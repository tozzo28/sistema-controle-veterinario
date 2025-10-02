-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_rabies_vaccine_records" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeAnimal" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nomeTutor" TEXT NOT NULL,
    "dataVacinacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "localVacinacao" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "quadra" TEXT NOT NULL,
    "loteVacina" TEXT NOT NULL,
    "dosePerdida" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_rabies_vaccine_records" ("area", "dataVacinacao", "id", "localVacinacao", "loteVacina", "nomeAnimal", "nomeTutor", "quadra", "tipo") SELECT "area", "dataVacinacao", "id", "localVacinacao", "loteVacina", "nomeAnimal", "nomeTutor", "quadra", "tipo" FROM "rabies_vaccine_records";
DROP TABLE "rabies_vaccine_records";
ALTER TABLE "new_rabies_vaccine_records" RENAME TO "rabies_vaccine_records";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
