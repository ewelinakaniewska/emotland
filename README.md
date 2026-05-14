# Emotland – Wsparcie Rozwoju Emocjonalnego Dzieci z ASD przy użyciu uczenia maszynowego 


> Projekt stworzony w celu wspierania terapii dzieci ze spektrum autyzmu poprzez innowacyjne podejście do nauki rozpoznawania emocji.

---

## O projekcie
**Emotland** to kompleksowa aplikacja edukacyjna zaprojektowana w celu wspierania nauki rozumienia i wyrażania emocji u dzieci z zaburzeniami ze spektrum autyzmu (ASD). System stanowi narzędzie wspomagające proces terapeutyczny, oferując stabilne, zorganizowane środowisko wizualne, wolne od nadmiaru bodźców.

Głównym innowacyjnym elementem systemu jest model uczenia maszynowego (sieci neuronowe) do rozpoznawania emocji na twarzy użytkownika w czasie rzeczywistym.

## Główne Role i Funkcjonalności

Aplikacja opiera się na trzech dedykowanych rolach, z których każda posiada odrębny zakres możliwości:

* **Dziecko:**
    * Realizacja interaktywnych zadań pogrupowanych w bloki i rozdziały.
    * **Tryb naśladowania emocji:** Wykorzystanie modelu rozpoznawania emocji wspierającego naukę.
    * **Panel powtórek:** Możliwość ponownego podejścia do błędnie rozwiązanych zadań.
    * Monitorowanie postępów i zdobywanie punktów.
* **Rodzic:**
    * Śledzenie historii i statystyk postępów dziecka w formie wykresów.
    * Komunikacja z terapeutą za pomocą wbudowanego czatu.
    * Dostęp do artykułów edukacyjnych i zarządzanie kontem dziecka.
* **Terapeuta:**
    * Tworzenie i edycja autorskich materiałów (zadania, bloki, rozdziały).
    * Monitorowanie aktywności wielu podopiecznych i wystawianie komentarzy do prób.
    * Publikowanie artykułów o tematyce ASD.

## Stos Technologiczny

System został zaprojektowany w architekturze klient-serwer z pełną konteneryzacją.

### Frontend
* **React + Vite:** Budowa szybkiego i responsywnego interfejsu SPA.
* **Socket.io-client:** Komunikacja w czasie rzeczywistym (czat).

### Backend (Node.js & Python)
* **Express.js:** Główna logika biznesowa, REST API oraz uwierzytelnianie.
* **FastAPI (Python):** Serwer dedykowany do obsługi modelu przewidywania emocji.
* **TensorFlow:** Silnik sieci neuronowej odpowiedzialny za rozpoznawanie emocji.
* **Socket.io:** Serwer WebSocket do obsługi komunikacji natychmiastowej.

### Baza Danych i Infrastruktura
* **MongoDB:** Dokumentowa baza danych (NoSQL).
* **Mongoose (ODM):** Modelowanie danych i walidacja po stronie backendu.
* **Docker & Docker Compose:** Pełna konteneryzacja wszystkich warstw systemu.
* **JWT (JSON Web Token):** Bezpieczne uwierzytelnianie z użyciem ciasteczek `HttpOnly`.

## Bezpieczeństwo
* **Ochrona haseł:** Haszowanie algorytmem `bcrypt`.
* **Zabezpieczenia NoSQL Injection:** Parametryzacja zapytań poprzez ODM Mongoose.

## Instalacja i Uruchomienie (Docker)

Aplikacja jest gotowa do uruchomienia w środowisku kontenerowym:

1.  **Sklonuj repozytorium:**
    ```bash
    git clone [https://github.com/ewelinakaniewska/emotland.git](https://github.com/ewelinakaniewska/emotland.git)
    cd emotland
    ```
2.  **Skonfiguruj zmienne środowiskowe:**
    Stwórz plik `.env` w głównym katalogu na podstawie pliku `.env.example`.
3.  **Uruchom system:**
    ```bash
    docker compose up --build
    ```
    System automatycznie uruchomi bazę danych, backend Node.js, moduł ML Python oraz frontend React.

---

**Projekt inżynierski obroniony na ocenę 5.0 (tytuł inżyniera).**
