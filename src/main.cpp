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
char *Speed1 = "speed1";
char *Run = "Run";
char *Trains = "trainSelect";
char *Edit_Type = "edit_type";
char *Save = "Save";

bool emergancy = false;
bool reverse = false;

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

int pin1 = 22;
int pin2 = 21;

double speed = 0.00;

String speedString = "0.00";
String testread = "";

void speedControl()
{
  int localchanel = 0;
  if (reverse == true)
  {
    localchanel = 1;
  }
  if (emergancy == false)
  {
    ledcWrite(localchanel, speed);
  }
  else
  {
    ledcWrite(0, 0);
    ledcWrite(1, 0);
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
              char *reverseParam = "reverse";
              if (request->hasParam(Speed1))
              {
                speedString = request->getParam(Speed1)->value();
                speed = speedString.toDouble();
              }
              if (request->hasParam(Run))
              {
                emergancy = !emergancy;
              }
              if (request->hasParam(reverseParam))
              {
                reverse = !reverse;
                ledcWrite(0, 0);
                ledcWrite(1, 0);
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

  server.on("/add", HTTP_GET, [](AsyncWebServerRequest *request) {

  });

  server.on("/edit_train", HTTP_GET, [](AsyncWebServerRequest *request)
            {

              char *e_type = "edit_type";
              char *e_id   = "edit_id";
              char *e_max_speed = "edit_speed";
              char *del         = "Del";
              char *e_isAdd  = "isAdd";

              int id = 0;
              int index = 0;
              String type; 
              int max_speed = 0;
              
              if(request->hasParam(Edit_Type)) {
                Serial.println("Edit Type: ");
                Serial.println(request->getParam(Edit_Type)->value());
              }

              if(SD_MMC.exists("/Trains.json")) 
              {
                  request->send(SD_MMC, "/Trains.json", "application/json");
                  File file = SD_MMC.open("/Trains.json", FILE_READ);
                    DynamicJsonDocument doc(2048);
                    DeserializationError error = deserializeJson(doc, file);
                  file.close();
                  if (error) {
                    Serial.println("Fehler beim Parsen der JSON");
                  }
                  else
                  {
                    if(request->hasParam(Save))
                    {
                    id = request->getParam(e_id)->value().toInt();
                    index = id - 1;
                    type = request->getParam(e_type)->value();
                    max_speed = request->getParam(e_max_speed)->value().toInt();

                    Serial.println(id);
                    Serial.println(max_speed);
                      if (request->getParam(e_isAdd)->value() == "on")
                      {
                        doc["Train"][index]["id"] = id;    
                      }
                    doc["Train"][index]["type"] = type;
                    doc["Train"][index]["max_speed"] = max_speed;
                   File file = SD_MMC.open("/Trains.json", FILE_WRITE);
                    if (serializeJson(doc, file) == 0) {
                      Serial.println("Fehler beim Schreiben der Datei");
                    }
                    file.close();
                    request->send(LittleFS, "/Trains.html");
                    }
                    if (request->hasParam(del))
                    {
                      id = request->getParam(e_id)->value().toInt();
                      index = id - 1;
                      type = request->getParam(e_type)->value();
                      max_speed = request->getParam(e_max_speed)->value().toInt();

                      doc["Train"].remove(index);

                      File file = SD_MMC.open("/Trains.json", FILE_WRITE);
                      if (serializeJson(doc, file) == 0) {
                      Serial.println("Fehler beim Schreiben der Datei");
                      }
                      file.close();

                      Serial.println("Deletet");

                      request->send(LittleFS, "/Trains.html");
                      
                    }
                  
                } 
              }else {
                  request->send(404, "text/plain", "Datei nicht gefunden");
                } });

  server.onNotFound([](AsyncWebServerRequest *request)
                    { request->send(404, "text/plain", "Seite nicht vorhanden!"); });
  server.begin(); // Den Server starten mit der Methode begin()
}

void setup()
{
  Serial.begin(115200); // serielle Schnittstelle initialisieren

  ledcSetup(0, 16000, 8); // Channel 16 kHz frequency, 8-bit resolution
  ledcAttachPin(pin1, 0);
  ledcAttachPin(pin2, 1);
  ledcWrite(0, speed);

  if (!LittleFS.begin())
  {
    Serial.println("An Error has occurred while mounting LittleFS!");
  }

  File file = LittleFS.open("/config.json", FILE_READ);
  DynamicJsonDocument doc(2048);
  DeserializationError error = deserializeJson(doc, file);
  file.close();

  if (error)
  {
    Serial.print("Parsing fehlgeschlagen: ");
    Serial.println(error.f_str());
  }

  const char *ssid = doc["wlan"];
  const char *passwort = doc["pww"];

  const char *hotspot = doc["hotspot"];
  const char *passworth = doc["pwh"];

  Serial.print("Verbindungsaufbau zu ");
  Serial.println(ssid);
  WiFi.begin(ssid, passwort); // WiFi-Verbindung herstellen
  // warten bis Verbindung steht
  int count = 0;
  while (WiFi.status() != WL_CONNECTED && count < 60)
  {
    Serial.print(".");
    delay(500);
    if (count == 30)
    {
      Serial.println("Fehelgeschlagen, versuchen neues Wlan");
      WiFi.begin(hotspot, passworth);
    }
    count++;
  }
  if (WiFi.status() == WL_CONNECTED)
  {
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

    Serverinit();
  }
  else
  {
    Serial.println("Verbindung Fehlgeschlagen! Empfohlen: ESP32 Neustarten");
  }
}

void loop()
{
}

#endif.