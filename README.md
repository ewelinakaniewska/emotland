# Emotland – Wsparcie Rozwoju Emocjonalnego Dzieci z ASD przy użyciu uczenia maszynowego 

Kompleksowy system wspomagania terapii dzieci ze spektrum autyzmu, oparty na architekturze wielousługowej (multi-service), wykorzystujący sieci konwolucyjne (CNN) do analizy afektywnej w czasie rzeczywistym.

## Architektura Systemu

System został zaprojektowany w modelu klient-serwer z wyraźnym podziałem na odpowiedzialności (Separation of Concerns):

1.  **Frontend (SPA):** React 19 zorientowany na komponenty, wykorzystujący Context API do zarządzania stanem globalnym.
2.  **Główny Serwis API:** Node.js (Express) – serce systemu odpowiedzialne za komunikację między wszystkimi modułami, bezpieczeństwo (logowanie) oraz zarządzanie bazą danych.
3.  **ML Inference Service:** Python (FastAPI) – osobny serwis odpowiedzialny za analizę obrazu z kamery i rozpoznawanie emocji użytkownika w czasie rzeczywistym.
4.  **Baza Danych:** MongoDB – dokumentowa baza danych obsługująca dynamiczne struktury zadań i logi aktywności użytkowników.

## Stos Technologiczny

### Frontend
- **Framework:** React 19 (Vite)
- **Stylizacja:** Tailwind CSS 4.0
- **Zarządzanie stanem:** React Context API + Custom Hooks
- **Komunikacja:** Axios + Custom Interceptors (obsługa sesji)
- **Wizualizacja danych:** Recharts (analityka postępów terapeutycznych)
- **Real-time:** Socket.io-client

### Backend (Node.js)
- **Środowisko:** Node.js + Express.js
- **Bezpieczeństwo:** JWT (Access & Refresh Tokens) w standardzie HttpOnly Cookies
- **Komunikacja dwukierunkowa:** Socket.io (czat terapeuta-rodzic)
- **ODM:** Mongoose

### ML Inference Service (Python)
- **Framework:** FastAPI
- **Silnik ML:** TensorFlow / Keras (Model konwolucyjny CNN)
- **Przetwarzanie obrazu:** OpenCV
- **Protokół komunikacji:** REST API (Multipart/form-data)

## Kluczowe Implementacje Techniczne

### Zaawansowany Moduł Autoryzacji i Sesji
Zastosowano mechanizmy zapewniające wysoki poziom bezpieczeństwa i UX:
- **Dual Token Strategy:** Implementacja krótkoterminowych Access Tokenów i długoterminowych Refresh Tokenów.
- **Axios Interceptors:** Automatyczne przechwytywanie błędów 401, kolejkowanie żądań (`pendingRequests`) i transparentne odświeżanie sesji bez przerywania pracy użytkownika.
- **RBAC (Role-Based Access Control):** Granularne zarządzanie dostępem do zasobów (Dziecko / Rodzic / Terapeuta) na poziomie middleware i komponentów Higher-Order (HOC).

### Optymalizacja Potoku Przetwarzania ML
- **Process Isolation:** Odizolowanie procesów uczenia maszynowego w dedykowanym serwisie FastAPI zapobiega blokowaniu pętli zdarzeń (Event Loop) głównego serwisu Node.js podczas operacji na macierzach.
- **Model Architecture:** Wykorzystanie sieci CNN zoptymalizowanej pod kątem klasyfikacji 7 klas emocji, zaimplementowanej w środowisku asynchronicznym.

### Architektura Danych i Skalowalność
- **Dynamic Task Engine:** Polimorficzna struktura zadań (Single Choice, ML Emotion Recognition) umożliwiająca terapeutom tworzenie spersonalizowanych ścieżek edukacyjnych.
- **Analityka:** Implementacja złożonych agregacji MongoDB do generowania raportów wydajnościowych (skuteczność vs. czas reakcji dziecka).

## Konteneryzacja i Orkiestracja

Projekt wykorzystuje pełną konteneryzację, co zapewnia determinizm środowiska:

- **Docker Compose:** Zarządzanie trzema kontenerami: `web-client`, `express-api` oraz `python-api`.
- **Nginx:** Skonfigurowany jako Reverse Proxy, obsługujący routing ruchu, terminację zapytań i serwowanie zasobów statycznych.

### Procedura uruchomienia:

1.  Zdefiniuj zmienne środowiskowe w pliku `.env` na podstawie `.env.example`.
2.  Zbuduj i uruchom infrastrukturę:
```bash
docker-compose up --build
```
## Modele Danych (Data Schema)

- **User:** Hierarchiczne modelowanie użytkowników w oparciu o role (RBAC) z zachowaniem relacji nadrzędności i powiązań (Rodzic/Terapeuta — Dziecko).
- **Task:** Abstrakcyjna definicja zadań wspierająca różne moduły logiczne, w tym moduł klasyfikacji wizyjnej oparty na uczeniu maszynowym.
- **UserTask:** Dokumentacja sesji i każdej interakcji podopiecznego z systemem (wskaźniki trafności predykcji, metadane techniczne, szczegółowa analiza czasu reakcji).

---
### Autor
**Ewelina Kaniewska** *Projekt zrealizowany w ramach pracy inżynierskiej (Ocena: 5.0)*
