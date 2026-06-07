#if 0
//test
#include <Arduino.h>
#include <FS.h>
#include <SD_MMC.h> // Wichtig: Andere Bibliothek als vorher!
#include "esp_heap_caps.h"
#include "LittleFS.h"

void setup() {
  Serial.begin(115200);
  
  // LittleFS mounten
  if (!LittleFS.begin()) {
    Serial.println("Fehler beim Mounten von LittleFS");
    return;
  }

  Serial.println("--- Dateien auf LittleFS: ---");

  // Wurzelverzeichnis öffnen
  File root = LittleFS.open("/");
  if (!root) {
    Serial.println("Verzeichnis konnte nicht geöffnet werden");
    return;
  }
  if (!root.isDirectory()) {
    Serial.println("Pfad ist kein Verzeichnis");
    return;
  }

  // Dateien iterieren
  File file = root.openNextFile();
  while (file) {
    Serial.print("Datei: ");
    Serial.print(file.name());
    Serial.print("  |  Größe: ");
    Serial.print(file.size());
    Serial.println(" Bytes");
    
    file = root.openNextFile();
  }
  
  Serial.println("--- Ende der Liste ---");
}

void loop() {
  // Nichts zu tun
}

// void setup()
// {
//   Serial.begin(115200);
//   delay(2000);

//   Serial.println("\n--- SD_MMC HARDWARE TEST (uPesy Wrover) ---");

//   // PSRAM Kurzcheck (muss bei WROVER immer dabei sein)
//   if (psramInit())
//   {
//     Serial.printf("✅ PSRAM OK: %d MB frei\n", ESP.getFreePsram() / 1024 / 1024);
//   }

//   // SD_MMC Initialisierung
//   // Der Parameter "true" bei begin() bedeutet: 1-Bit Modus.
//   // Das ist langsamer, aber kompatibler mit fast allen ESP32-Slots.
//   Serial.println("Versuche SD_MMC zu starten...");

//   if (!SD_MMC.begin("/sdcard", true))
//   {
//     Serial.println("❌ SD_MMC Initialisierung fehlgeschlagen.");
//     Serial.println("Mögliche Gründe:");
//     Serial.println("- Karte nicht richtig im Slot");
//     Serial.println("- Karte ist nicht FAT32 formatiert");
//     Serial.println("- Slot ist doch über SPI (Schritt 1) angebunden");
//   }
//   else
//   {
//     Serial.println("✅ SD_MMC ERFOLGREICH VERBUNDEN!");

//     // Kartendaten auslesen
//     uint8_t cardType = SD_MMC.cardType();
//     Serial.print("Kartentyp: ");
//     if (cardType == CARD_MMC)
//       Serial.println("MMC");
//     else if (cardType == CARD_SD)
//       Serial.println("SDSC");
//     else if (cardType == CARD_SDHC)
//       Serial.println("SDHC");
//     else
//       Serial.println("Unbekannt");

//     uint64_t cardSize = SD_MMC.cardSize() / (1024 * 1024);
//     Serial.printf("Speicherkapazität: %llu MB\n", cardSize);

//     // Testdatei erstellen
//     File file = SD_MMC.open("/test.txt", FILE_WRITE);
//     if (file)
//     {
//       file.println("Hallo vom uPesy Wrover!");
//       file.close();
//       Serial.println("✅ Testdatei '/test.txt' wurde erfolgreich geschrieben!");
//     }
//     else
//     {
//       Serial.println("❌ Schreiben der Testdatei fehlgeschlagen.");
//     }
//   }
//   Serial.println("------------------------------------------\n");
// }

// void loop() {}

#endif