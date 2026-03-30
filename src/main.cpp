#if 1

#include <Arduino.h>
#include <esp_heap_caps.h>
#include <ArduinoJson.h>
#include <WiFi.h>              //Einbinden der WiFi-Bibliothek
#include <ESPAsyncWebServer.h> //Einbinden der Webserver-Bibliothek
#include <LittleFS.h>
#include <Wire.h> // Wire Bibliothek für I2C-Display
#include <SD_MMC.h>
#include "SPI.h"

// Beispiel LM75 auf dem Carrier Board hat
// die Adresse 1001.000R/W. Diese 7 Bits entsprechen 0x48
#define SLAVE_ADR 0x48 // I2C 7-Bit-Adr

// Ein Objekt namens server erstellen. Der Bauplan bzw. die Klasse des
// Objekts heisst AsyncWebServer. Wir benutzen spaeter die Methoden
// on(), onNotFound() und begin() des Objekts. 80 bedeutet, dass der
// Webserver auf Port 80 Anfragen erwartet. Dies ist der Standard HTTP-Port.
AsyncWebServer server(80);

// WLAN-Zugangsdaten
char *ssid = "MagentaWLAN-9YPW";         // hier muss die SSID stehen
char *passwort = "39130840523380688734"; // hier muss das Passwort stehen
char *Speed1 = "speed1";
char *Run = "Run";
char *Trains = "trainSelect";
char *Edit_Type = "edit_type";

bool emergancy = false;

struct SpiRamAllocator
{
  void *allocate(size_t size)
  {
    return heap_caps_malloc(size, MALLOC_CAP_SPIRAM);
  }
  void deallocate(void *pointer)
  {
    heap_caps_free(pointer);
  }
};
using SpiRamJsonDocument = BasicJsonDocument<SpiRamAllocator>;

int pin = 22;

double speed = 0.0;

String speedString = "0.0";

void speedControl()
{
  if (emergancy == false)
  {
    ledcWrite(0, speed);
  }
  else
  {
    ledcWrite(0, 0);
  }
  Serial.println(speed);
}
void Serverinit()
{

  // Die Antworten des Servers definieren
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(LittleFS, "/index.html", String(), false); });
  server.on("/Trains.html", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(LittleFS, "/Trains.html", String(), false); });

  server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(LittleFS, "/style.css"); });

  server.on("/trainlist_style.css", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(LittleFS, "/trainlist_style.css"); });

  server.on("/logic.js", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(LittleFS, "/logic.js"); });

  server.on("/train_icon.png", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(LittleFS, "/train_icon.png"); });

  server.on("/menuIcon.svg", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(LittleFS, "/menuIcon.svg"); });

  server.on("/get", HTTP_GET, [](AsyncWebServerRequest *request)
            {
              if (request->hasParam(Speed1))
              {
                speedString = request->getParam(Speed1)->value();
                speed = speedString.toDouble();
              }
              if (request->hasParam(Run))
              {
                emergancy = !emergancy;
              }
              speedControl();
              request->send(LittleFS, "/index.html"); });

  server.on("/get-trains", HTTP_GET, [](AsyncWebServerRequest *request)
            {
              if(SD_MMC.exists("/Trains.json")) {
                request->send(SD_MMC, "/Trains.json", "application/json");
            } else {
              request->send(404, "text/plain", "Datei nicht gefunden");
            } });

  server.on("/get_edit", HTTP_GET, [](AsyncWebServerRequest *request)
            {
              if(request->hasParam(Edit_Type)) {
                Serial.println("Edit Type: ");
                Serial.println(request->getParam(Edit_Type)->value());
              }
              Serial.println("Edit Request received");
              //   if(SD_MMC.exists("/Trains.json")) {
              //     request->send(SD_MMC, "/Trains.json", "application/json");
              //     Serial.print("Test: ");

              //     // File file = SD_MMC.open("/Trains.json", FILE_WRITE);
              //     // file.print("{\"id\": 7, \"type\": \"Dampflok\", \"speed\": 0.5}");
              //     // file.close();
              // } else {
              request->send(404, "text/plain", "Datei nicht gefunden"); });

  server.onNotFound([](AsyncWebServerRequest *request)
                    { request->send(404, "text/plain", "Seite nicht vorhanden!"); });
  server.begin(); // Den Server starten mit der Methode begin()
}

void setup()
{
  ledcSetup(0, 16000, 8); // Channel 0, 5 kHz frequency, 8-bit resolution
  ledcAttachPin(pin, 0);
  ledcWrite(0, speed);

  Serial.begin(115200); // serielle Schnittstelle initialisieren
  Serial.print("Verbindungsaufbau zu ");
  Serial.println(ssid);
  WiFi.begin(ssid, passwort); // WiFi-Verbindung herstellen
  // warten bis Verbindung steht
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.print("Verbindung hergestellt.\n Lokale IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("ESP Board MAC Adresse: ");
  Serial.println(WiFi.macAddress());

  // PSRAM für den WROVER aktivieren
  if (psramInit())
    Serial.println("PSRAM OK");

  // 2. SD_MMC Initialisierung
  // Hinweis: Beim WROVER nutzt SD_MMC meist GPIO 2, 14, 15, 12, 13
  if (!SD_MMC.begin("/sdcard", true))
  {
    Serial.println("SD_MMC Karte konnte nicht gemountet werden!");
  }
  else
  {
    Serial.println("SD_MMC bereit.");
  }

  if (!LittleFS.begin())
  {
    Serial.println("An Error has occurred while mounting LittleFS!");
  }
  Serverinit();
}

void loop()
{
  // Serial.print("Aktuelle Geschwindigkeit: ");
  // Serial.println(speed);
  // analogWrite(pin, speed);
}

#endif