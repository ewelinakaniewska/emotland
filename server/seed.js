import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import { User } from "./models/User.js";
import { Message } from "./models/Message.js";
import { Task } from "./models/Task.js";
import { Article } from "./models/Article.js";
import { UserTask } from "./models/UserTask.js";
import { Block } from "./models/Block.js";
import { Chapter } from "./models/Chapter.js";


dotenv.config();

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Database");

        await Promise.all([
            User.deleteMany(),
            Message.deleteMany(),
            Task.deleteMany(),
            UserTask.deleteMany(),
            Article.deleteMany(),
            Chapter.deleteMany(),
            Block.deleteMany()
        ]);
        console.log("Data cleared");

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('1234', salt);


        const children = await User.insertMany([
            {
                firstName: "Alicja",
                name: "ala12",
                age: new Date("2012-03-15"),
                password: await bcrypt.hash('1234', 10),
                role: "child",

            },
            {
                firstName: "Marta",
                name: "marti10",
                age: new Date("2014-03-15"),
                password: await bcrypt.hash('1234', 10),
                role: "child",

            },
            {
                firstName: "Kacper",
                name: "kacpi",
                age: new Date("2010-03-15"),
                password: await bcrypt.hash('1234', 10),
                role: "child",

            },
            {
                firstName: "Jan",
                name: "jasiek",
                age: new Date("2013-03-15"),
                password: await bcrypt.hash('1234', 10),
                role: "child",

            },
            {
                firstName: "Michał",
                name: "michal11",
                age: new Date("2015-03-15"),
                password: await bcrypt.hash('1234', 10),
                role: "child",

            }

        ]);
        const parents = await User.insertMany([
            {
                firstName: "Anita",
                lastName: "Bieluń",
                email: "abielun@gmail.com",
                password: await bcrypt.hash('1234', 10),
                role: "parent",
                newsletter: true,
                child: [children[0]._id, children[1]._id]

            },
            {
                firstName: "Tomasz",
                lastName: "Kowalski",
                email: "tkowalski@gmail.com",
                password: await bcrypt.hash('1234', 10),
                role: "parent",
                newsletter: false,
                child: [children[2]._id]

            },
            {
                firstName: "Magda",
                lastName: "Kot",
                email: "mkot@gmail.com",
                password: await bcrypt.hash('1234', 10),
                role: "parent",
                newsletter: true,
                child: [children[3]._id]

            },
            {
                firstName: "Weronika",
                lastName: "Przybyła",
                email: "wprzybyla@gmail.com",
                password: await bcrypt.hash('1234', 10),
                role: "parent",
                newsletter: true,
                child: [children[4]._id]
            }

        ]);

        const therapists = await User.insertMany([
            {
                firstName: "Mariola",
                lastName: "Nowak",
                email: "mnowak@gmail.com",
                password: await bcrypt.hash('1234', 10),
                role: "therapist",
                parent: [parents[0]._id],
                code: "ther1"

            },
            {
                firstName: "Wiktor",
                lastName: "Markowski",
                email: "wmarkowski@gmail.com",
                password: await bcrypt.hash('1234', 10),
                role: "therapist",
                parent: [parents[1]._id, parents[2]._id],
                code: "ther2"

            },
            {
                firstName: "Małgorzata",
                lastName: "Konieczna",
                email: "mkonieczna@gmail.com",
                password: await bcrypt.hash('1234', 10),
                role: "therapist",
                code: "ther3"

            }

        ]);

        const tasks = await Task.insertMany([
            {
                text: "Co czuje chłopiec na zdjęciu?",
                options: ["radość", "smutek", "zaskoczenie", "złość"],
                correctIndex: 0,
                hint: "Zwróć uwagę na oczy!",
                img: "/images/photo1.jpg",
                category: "happiness",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[0]._id,
                explanation: "Zmrużone oczy, rozluźnione brwi i szeroki uśmiech często znaczą, że ktoś czuje radość."
            },
            {
                text: "Co czuje chłopiec na zdjęciu?",
                options: ["strach", "smutek", "zaskoczenie", "radość"],
                correctIndex: 3,
                hint: "Przyjrzyj się ustom!",
                img: "/images/photo2.jpg",
                category: "happiness",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[0]._id,
                explanation: "Szeroki uśmiech często znaczy, że ktoś czuje radość."
            },
            {
                text: "Co czuje dziewczynka na zdjęciu?",
                options: ["złość", "zniesmaczenie", "radość", "strach"],
                correctIndex: 2,
                hint: "Przyjrzyj się ustom!",
                img: "/images/photo3.jpg",
                category: "happiness",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Szeroki uśmiech często znaczy, że ktoś czuje radość."
            },
            {
                text: "Co czuje dziewczynka na obrazku?",
                options: ["złość", "radość", "smutek", "zaskoczenie"],
                correctIndex: 1,
                hint: "Zobacz jaki kształt mają usta",
                img: "/images/photo4.jpg",
                category: "happiness",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Szeroki uśmiech i zmrużone oczy często znaczą, że ktoś czuje radość."

            },
            {
                text: "Co czuje osoba na obrazku?",
                options: ["złość", "smutek", "strach", "radość"],
                correctIndex: 1,
                hint: "W którą stronę skierowane są kąciki ust?",
                img: "/images/photo5.jpg",
                category: "sadness",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Kąciki ust skierowane w dół często znaczą, że ktoś odczuwa smutek."

            },
            {
                text: "Co czuje chłopiec na obrazku?",
                options: ["zniesmaczenie", "radość", "strach", "smutek"],
                correctIndex: 3,
                hint: "Jak wyglądają jego oczy?",
                img: "/images/photo6.jpg",
                category: "sadness",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Spojrzenie skierowane w dół i neutralny wyraz ust mówią, że chłopiec jest smutny."
            },
            {
                text: "Co czuje dziewczynka na obrazku?",
                options: ["złość", "smutek", "strach", "radość"],
                correctIndex: 1,
                hint: "Popatrz na jej oczy!",
                img: "/images/photo7.jpg",
                category: "sadness",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Dziewczynka ma lekko wydęte usta, których kąciki są skierowane w dół. Jej brwi są lekko zmarszczone. To sugeruje, że dziewczynka odczuwa smutek."

            },
            {
                text: "Co czuje chłopiec na obrazku?",
                options: ["złość", "smutek", "zaskoczenie", "zniesmaczenie"],
                correctIndex: 1,
                hint: "Popatrz na jego usta",
                img: "/images/photo8.jpg",
                category: "sadness",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Lekko wydęte usta, kąciki skierowane w dół, delikatnie zmarszczone brwi - to mówi, że chłopiec jest smutny."

            },
            {
                text: "Co czuje dziewczyna na obrazku?",
                options: ["złość", "zniesmaczenie", "strach", "zaskoczenie"],
                correctIndex: 3,
                hint: "Jak wyglądają jej usta i oczy?",
                img: "/images/photo9.jpg",
                category: "surprise",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Dziewczynka ma szeroko otwarte usta i szeroko otwarte oczy. Oprócz tego zobacz jak przykłada ręce do swoich policzków. To wskazuje na zaskoczenie dziewczynki."

            },
            {
                text: "Co czuje chłopiec na obrazku?",
                options: ["złość", "zaskoczenie", "radość", "zniesmaczenie"],
                correctIndex: 1,
                hint: "Jak wyglądają jego usta?",
                img: "/images/photo10.jpg",
                category: "surprise",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Chłopiec ma szeroko otwarte oczy i brwi uniesione wysoko do góry. Zobacz jak jego usta układają się w kształt literki O. To mówi, źe chłopiec jest zaskoczony."

            },
            {
                text: "Co czuje chłopiec na obrazku?",
                options: ["złość", "strach", "radość", "zaskoczenie"],
                correctIndex: 3,
                hint: "Jak wyglądają jego brwi?",
                img: "/images/photo11.jpg",
                category: "surprise",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Chłopiec ma szeroko otwarte oczy i brwi uniesione wysoko do góry. Jego usta są dość szeroko otwarte. To znaczy, źe chłopiec jest zaskoczony."

            },
            {
                text: "Co czuje chłopiec na obrazku?",
                options: ["złość", "strach", "zaskoczenie", "radość"],
                correctIndex: 2,
                hint: "Jak wyglądają jego usta?",
                img: "/images/photo12.jpg",
                category: "surprise",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Chłopiec ma szeroko otwarte oczy i brwi uniesione wysoko do góry. Jego usta też są szeroko otwarte. To znaczy, źe chłopiec jest zaskoczony."

            },
            {
                text: "Co czuje dziewczyna na obrazku?",
                options: ["złość", "strach", "zaskoczenie", "radość"],
                correctIndex: 2,
                hint: "Zwróć uwagę na brwi",
                img: "/images/photo13.jpg",
                category: "anger",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Brwi dziewczynki są mocno zmarszczone. To często wskazuje na złość."

            },
            {
                text: "Co czuje chłopiec na obrazku?",
                options: ["strach", "radość", "zaskoczenie", "złość"],
                correctIndex: 3,
                hint: "Zwróć uwagę na oczy",
                img: "/images/photo14.jpg",
                category: "anger",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Oczy chłopca są zmrużone, a brwi zmarszczone - chłopiec czuje złość."

            },
            {
                text: "Co czuje dziewczynka na obrazku?",
                options: ["strach", "radość", "zaskoczenie", "złość"],
                correctIndex: 3,
                hint: "Zwróć uwagę na zmarszczkę pod oczami",
                img: "/images/photo15.jpg",
                category: "anger",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Dolne powieki dziewczynki są lekko zmarszczone, a usta delikatnie zaciśnięte, co wskazuje na to, że dziewczynka czuje złość."

            },
            {
                text: "Co czuje chłopiec na obrazku?",
                options: ["złosć", "radość", "zaskoczenie", "strach"],
                correctIndex: 3,
                hint: "Zwróć uwagę na brwi",
                img: "/images/photo16.jpg",
                category: "anger",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Zmarszczone brwi chłopca i lekko wydęte usta wskazują na to, że chłopiec czuje złość."

            },
            {
                text: "Co czuje dziewczynka na obrazku?",
                options: ["złosć", "radość", "zaskoczenie", "zniesmaczenie"],
                correctIndex: 3,
                hint: "Zwróć uwagę na usta",
                img: "/images/photo17.jpg",
                category: "disgust",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Zmarszczone brwi dziewczynki i grymas na ustach wskazują na to, że dziewczynka czuje zniesmaczenie."

            },
            {
                text: "Co czuje dziewczynka na obrazku?",
                options: ["złosć", "radość", "zniesmaczenie", "zaskoczenie"],
                correctIndex: 2,
                hint: "Zwróć uwagę na oczy",
                img: "/images/photo18.jpg",
                category: "disgust",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Dziewczynka ma zmrużone oczy i jedną brew uniesioną bardziej od drugiej. Oprócz tego ma ustach grymas. To wskazuje na to, że dziewczyna czuje zniesmaczenie."

            },
            {
                text: "Co czuje dziewczynka na obrazku?",
                options: ["zniesmaczenie", "radość", "strach", "zaskoczenie"],
                correctIndex: 0,
                hint: "Zwróć uwagę na oczy",
                img: "/images/photo19.jpg",
                category: "disgust",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Dziewczynka ma zmrużone oczy i zmarszczone brwi. Oprócz tego ma zaciśnięte i lekko wykrzywione usta. To wskazuje na to, że dziewczyna czuje zniesmaczenie."

            },
            {
                text: "Co czuje dziewczynka na obrazku?",
                options: ["zniesmaczenie", "radość", "złość", "strach"],
                correctIndex: 3,
                hint: "Zwróć uwagę na oczy",
                img: "/images/photo20.jpg",
                category: "disgust",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Dziewczynka ma całkowicie zmrużone oczy i zmarszczone brwi. Ma otwarte usta układające się w grymas. To mówi, że dziewczyna czuje zniesmaczenie."

            },
            {
                text: "Co czuje chłopiec na obrazku?",
                options: ["zniesmaczenie", "radość", "strach", "zaskoczenie"],
                correctIndex: 2,
                hint: "Zwróć uwagę na postawę chłopca.",
                img: "/images/photo21.jpg",
                category: "fear",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Chłopiec ma szeroko otwarte oczy, brwi uniesione wysoko do góry oraz szeroko otwarte usta. Jest lekko skulony i zasłania się dłońmi. To znaczy, że chłopiec czuje strach."
            },
            {
                text: "Co czuje dziewczynka na obrazku?",
                options: ["strach", "radość", "złość", "zaskoczenie"],
                correctIndex: 0,
                hint: "Przyjrzyj się brwiom i ustom.",
                img: "/images/photo22.jpg",
                category: "fear",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Dziewczynka ma lekko zmrużone oczy, uniesione brwi i szeroko otwarte usta. Zobacz jak brwi są wyżej na środku twarzy w porównaniu so boków. To mówi, że dziewczynka czuje strach."
            },
            {
                text: "Co czuje dziewczynka na obrazku?",
                options: ["strach", "zniesmaczenie", "złość", "radość"],
                correctIndex: 0,
                hint: "Przyjrzyj się brwiom.",
                img: "/images/photo23.jpg",
                category: "fear",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Dziewczynka jest lekko zgarbiona, podnosi dłonie do twarzy i ma zmarszczone brwi. To znaczy, że odczuwa strach."
            },
            {
                text: "Co czuje dziewczynka na obrazku?",
                options: ["radość", "zniesmaczenie", "złość", "strach"],
                correctIndex: 3,
                hint: "Przyjrzyj się brwiom.",
                img: "/images/photo24.jpg",
                category: "fear",
                questionType: "single_choice",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
                explanation: "Brwi dziewczynki są uniesione i lekko zmarszczone, ma szeroko otwarte oczy i otwarte usta. Przykłada dłonie do twarzy. To znaczy, że dziewczynka czuje strach."
            },
            {
                text: "Spróbuj pokazać radość!",
                hint: "Pamiętaj o szerokim uśmiechu",
                category: "happiness",
                questionType: "ai",
                ageCategory: "junior",
                difficulty: "easy",
                author: therapists[1]._id,
            }



        ]);

        const blocks = await Block.insertMany([
            {
                title: "Blok 1",
                order: 1,
                tasks: [
                    tasks[24]._id,
                    tasks[15]._id,
                    tasks[7]._id
                ],
                xPercent: 26,
                yPercent: 75
            },
            {
                title: "Blok 2",
                order: 2,
                tasks: [
                    tasks[1]._id,
                    tasks[5]._id,
                    tasks[6]._id
                ],
                xPercent: 57,
                yPercent: 75

            }
            , {
                title: "Blok 3",
                order: 3,
                tasks: [
                    tasks[2]._id,
                    tasks[13]._id,
                    tasks[8]._id
                ],
                xPercent: 45,
                yPercent: 58
            }
            , {
                title: "Blok 4",
                order: 3,
                tasks: [
                    tasks[3]._id,
                    tasks[22]._id,
                    tasks[16]._id
                ],
                xPercent: 26,
                yPercent: 48
            }, {
                title: "Blok 5",
                order: 3,
                tasks: [
                    tasks[21]._id,
                    tasks[10]._id,
                    tasks[19]._id
                ],
                xPercent: 61,
                yPercent: 42
            },
            {
                title: "Blok 6",
                order: 3,
                tasks: [
                    tasks[23]._id,
                    tasks[9]._id,
                    tasks[14]._id
                ],
                xPercent: 32,
                yPercent: 32
            },
            {
                title: "Blok 7",
                order: 3,
                tasks: [
                    tasks[11]._id,
                    tasks[20]._id,
                    tasks[17]._id
                ],
                xPercent: 47,
                yPercent: 19
            }
        ])

        const chapters = await Chapter.insertMany([{
            title: "Wyspa Malguna",
            order: 1,
            blocks: [
                blocks[0]._id,
                blocks[1]._id,
                blocks[2]._id,
                blocks[3]._id,
                blocks[4]._id,
                blocks[5]._id,
                blocks[6]._id
            ],
            difficulty: "easy",
            ageCategory:junior,
            assignedChildren: [children[0], children[1]],
            createdBy: therapists[0],
            img: "/images/island1.png"
        },
        {
            title: "Wyspa Cerlyt",
            order: 2,
            blocks: [
                blocks[0]._id,
                blocks[1]._id,
                blocks[2]._id,
                blocks[3]._id,
                blocks[4]._id,
                blocks[5]._id,
                blocks[6]._id
            ],
            difficulty: "easy",
            createdBy: therapists[0],
            ageCategory:junior,
            assignedChildren: [children[0]],
            img: "/images/island1.png"
        },
        {
            title: "Wyspa Rotilwa",
            order: 3,
            blocks: [
                blocks[0]._id,
                blocks[1]._id,
                blocks[2]._id,
                blocks[3]._id,
                blocks[4]._id,
                blocks[5]._id,
                blocks[6]._id
            ],
            difficulty: "easy",
            createdBy: therapists[0],
            ageCategory:junior,
            assignedChildren: [children[0], children[1]],
            img: "/images/island1.png"
        }])

        const userTasks = await UserTask.insertMany([
            {
                child: children[0]._id,
                task: tasks[0]._id,
                block: blocks[0]._id,
                attempts: 1,
                correct: true,
                time_taken: 8,
                score: 8,
                selected_answer: 1

            },
            {
                child: children[0]._id,
                task: tasks[1]._id,
                block: blocks[0]._id,
                attempts: 3,
                correct: false,
                time_taken: 20,
                score: 0,
                selected_answer: 0

            },
            {
                child: children[1]._id,
                task: tasks[4]._id,
                block: blocks[1]._id,
                attempts: 1,
                correct: true,
                time_taken: 6,
                score: 6,
                selected_answer: 3

            },

        ]);

        const articles = await Article.insertMany([
            {
                title: "Jak radzić sobie z małomównością?",
                text: `Małomówność, czyli ograniczona werbalna komunikacja, jest jednym z typowych wyzwań u dzieci z autyzmem. Niektóre dzieci mówią niewiele lub wcale, inne używają tylko kilku słów, powtarzają to, co usłyszały, albo komunikują się głównie gestami. To zjawisko może być stresujące zarówno dla rodziców, jak i dla dziecka, które często ma potrzebę komunikowania się, ale nie potrafi tego zrobić w tradycyjny sposób. Warto pamiętać, że małomówność nie oznacza braku myślenia ani uczuć. Dzieci z ograniczoną mową są świadome otoczenia i chętne do kontaktu – po prostu potrzebują wsparcia i odpowiednich narzędzi, by się porozumieć. Dlaczego dziecko może być małomówne? Przyczyny małomówności mogą być różnorodne: Trudności w przetwarzaniu bodźców sensorycznych – hałas, światło czy dotyk mogą powodować stres i blokować mowę. Opóźnienia w rozwoju języka i mowy. Lęk społeczny lub niepewność w kontaktach z innymi. Preferencja dla komunikacji niewerbalnej – niektóre dzieci lepiej wyrażają się gestami, rysunkami czy obrazkami. Zrozumienie przyczyny jest kluczowe, bo pozwala dobrać odpowiednie strategie wsparcia. Skuteczne strategie wsparcia Alternatywne metody komunikacji Wprowadzenie kart obrazkowych (PECS), symboli, gestów lub urządzeń wspomagających mowę pozwala dziecku wyrażać potrzeby i emocje. Wczesne nauczanie takich metod często prowadzi do wzrostu chęci do używania słów. Tworzenie spokojnego i przewidywalnego środowiska Dzieci z autyzmem reagują lepiej, gdy otoczenie jest uporządkowane i przewidywalne. Jasny plan dnia i spokój w otoczeniu sprzyjają koncentracji i zachęcają do komunikacji. Modelowanie i powtarzanie mowy Mów powoli i jasno, używając krótkich zdań. Nazywaj przedmioty, czynności i emocje, powtarzaj słowa, by dziecko mogło je zapamiętać i próbować powtarzać. Wzmocnienie pozytywne i cierpliwość Chwal każde osiągnięcie – nawet pojedyncze słowo, gest czy wskazanie obrazka. Dzieci uczą się poprzez pozytywne doświadczenia, a każde takie docenienie zwiększa pewność siebie i motywację. Współpraca ze specjalistami Logopeda, terapeuta zajęciowy, psycholog lub pedagog specjalny mogą wprowadzić indywidualne ćwiczenia i strategie wspierające rozwój mowy i komunikacji. Indywidualne podejście jest często kluczowe w osiąganiu postępów. Budowanie codziennej rutyny komunikacyjnej Zachęcaj dziecko do wypowiadania słów w naturalnych sytuacjach: przy posiłku, zabawie, ubieraniu się. Nawet krótkie interakcje są cennym treningiem i wzmacniają poczucie sprawczości. Podsumowanie Małomówność u dzieci z autyzmem jest wyzwaniem, ale nie przeszkodą w budowaniu relacji i rozwijaniu kompetencji. Cierpliwość, konsekwencja oraz otwartość na różne formy komunikacji pozwalają dziecku wyrażać siebie i stopniowo rozwijać mowę. Wsparcie specjalistów, pozytywne wzmocnienie i dostosowane strategie komunikacyjne pomagają nie tylko w nauce mowy, ale także w budowaniu pewności siebie i samodzielności dziecka.`,
                images: "images/photo3.jpg",
                category: ["rozwój", "mowa", "nieśmiałosć"],
                author: therapists[0]._id,

            },
            {
                title: "Echolalia – co oznacza i jak ją wspierać?",
                text: `Echolalia to powtarzanie słów, zwrotów lub zdań, które dziecko usłyszało od innych osób, z telewizji czy w książkach. Jest to częsty element rozwoju mowy u dzieci z autyzmem i nie zawsze oznacza brak zrozumienia – w wielu przypadkach pełni ważną funkcję komunikacyjną. Rodzaje echolalii Natychmiastowa echolalia Dziecko powtarza słowa lub zdania zaraz po ich usłyszeniu, np. „Chcesz jabłko?” → „Chcesz jabłko?”. Często występuje w procesie nauki języka i pomaga dziecku ćwiczyć wymowę i rytm mowy. Opóźniona echolalia Powtarzanie słów lub zwrotów z przeszłości, np. z programów telewizyjnych, książek lub wcześniejszych rozmów. Może służyć do wyrażania potrzeb, emocji lub komunikowania się w trudnych sytuacjach. Dlaczego dzieci używają echolalii? Nauka języka – powtarzanie pomaga w utrwalaniu słów i zwrotów. Komunikacja – niektóre dzieci używają powtarzanych zdań, aby wyrazić uczucia, prośby lub zgodzić się/nie zgodzić. Regulacja emocji – powtarzanie znanych słów może działać uspokajająco. Zainteresowanie dźwiękiem i rytmem – niektóre dzieci fascynują się brzmieniem słów. Jak wspierać dziecko z echolalią? Nie karz i nie krytykuj powtarzania Echolalia jest naturalnym etapem rozwoju języka i formą komunikacji. Próba jej „wyeliminowania” może być stresująca. Rozwijaj komunikację funkcjonalną Zachęcaj dziecko do używania powtarzanych słów w konkretnych sytuacjach. Modeluj krótkie, proste zdania odpowiadające potrzebom dziecka. Używaj wizualnych wspomagaczy Karty obrazkowe, symbole i gesty pomagają dziecku zrozumieć znaczenie słów i używać ich świadomie. Rozszerzaj wypowiedzi dziecka Jeśli dziecko powtarza np. „Chcesz jabłko?”, możesz dodać: „Tak, chcę jabłko. Proszę.” – w ten sposób uczysz pełnych zdań. Współpracuj ze specjalistami Logopeda i terapeuta zajęciowy mogą wprowadzić ćwiczenia wspierające przekształcanie echolalii w aktywną komunikację i rozwój języka. Podsumowanie Echolalia nie jest problemem do natychmiastowego „naprawienia”, lecz naturalnym etapem rozwoju językowego u wielu dzieci z autyzmem. Wsparcie opiera się na cierpliwości, modelowaniu języka, wykorzystaniu alternatywnych metod komunikacji i współpracy ze specjalistami. Dzięki odpowiedniemu podejściu echolalia może stać się narzędziem nauki mowy i sposobem na wyrażanie myśli, zamiast przeszkodą w komunikacji.`,
                images: "images/photo2.jpg",
                category: ["rozwój", "mowa"],
                author: therapists[0]._id,

            },
            {
                title: "Jak wspierać nawiązywanie kontaktów rówieśniczych?",
                text: `Dzieci z autyzmem często mają trudności w nawiązywaniu i utrzymywaniu relacji z rówieśnikami. Mogą nie rozumieć zasad społecznych, sygnałów niewerbalnych, a także odczuwać lęk w sytuacjach grupowych. Jednak przy odpowiednim wsparciu dzieci te mogą rozwijać umiejętności społeczne, budować przyjaźnie i czerpać radość ze wspólnych zabaw. Dlaczego kontakty rówieśnicze są ważne? Uczą współpracy i dzielenia się. Wzmacniają poczucie przynależności i pewność siebie. Pomagają w rozwijaniu empatii i rozumieniu emocji innych osób. Wspierają rozwój komunikacji werbalnej i niewerbalnej. Strategie wspierania kontaktów rówieśniczych Twórz bezpieczne, przewidywalne sytuacje społeczne Dzieci z autyzmem lepiej funkcjonują w środowisku, które jest uporządkowane i przewidywalne. Krótkie, jasno zaplanowane zabawy w małych grupach są bardziej skuteczne niż duże, chaotyczne spotkania. Wprowadzaj zabawy strukturalne i scenariusze społeczne Gry planszowe, odgrywanie ról i scenki z życia codziennego pomagają dziecku ćwiczyć współpracę, kolejność wypowiedzi i przestrzeganie prostych zasad społecznych. Modeluj i wyjaśniaj zasady społeczne Pokazuj, jak witać się, prosić o coś, dzielić się zabawkami czy reagować na emocje innych. Możesz używać ilustracji, obrazków lub krótkich historyjek społecznych (social stories). Stopniowo zwiększaj poziom trudności Zacznij od krótkich interakcji jeden na jeden, a potem przechodź do małych grup. Dziecko uczy się w naturalnym tempie, bez presji i poczucia porażki. Ułatwiaj inicjowanie kontaktu Podpowiadaj słowa lub gesty do rozpoczęcia rozmowy. Zachęcaj do zadawania pytań i słuchania odpowiedzi. Wprowadzaj „zadania wspólne”, np. układanie puzzli lub budowanie konstrukcji razem. Doceniaj każdy postęp Nawet krótkie interakcje, uśmiech, czy wspólna zabawa zasługują na pochwałę. Pozytywne wzmocnienie buduje motywację do kolejnych prób kontaktu. Współpracuj ze specjalistami Terapeuta zajęciowy, pedagog specjalny lub psycholog mogą wprowadzić indywidualne ćwiczenia społeczne, które są dopasowane do umiejętności i potrzeb dziecka. Podsumowanie Wsparcie w nawiązywaniu kontaktów rówieśniczych wymaga cierpliwości, konsekwencji i świadomego planowania sytuacji społecznych. Dzięki stopniowemu wprowadzaniu interakcji, modelowaniu zachowań i pozytywnemu wzmocnieniu, dzieci z autyzmem mogą rozwijać przyjaźnie, komunikować się skuteczniej i czerpać radość ze wspólnych zabaw. Wspólne sukcesy budują pewność siebie i poczucie przynależności w grupie.`,
                images: "images/photo23.jpg",
                category: ["rozwój", "przyjaźń", "nieśmiałosć"],
                author: therapists[0]._id,
            },
            {
                title: "Jak wspierać koncentrację i uwagę u dzieci?",
                text: `Dzieci z autyzmem często mają trudności w nawiązywaniu i utrzymywaniu relacji z rówieśnikami. Mogą nie rozumieć zasad społecznych, sygnałów niewerbalnych, a także odczuwać lęk w sytuacjach grupowych. Jednak przy odpowiednim wsparciu dzieci te mogą rozwijać umiejętności społeczne, budować przyjaźnie i czerpać radość ze wspólnych zabaw. Dlaczego kontakty rówieśnicze są ważne? Uczą współpracy i dzielenia się. Wzmacniają poczucie przynależności i pewność siebie. Pomagają w rozwijaniu empatii i rozumieniu emocji innych osób. Wspierają rozwój komunikacji werbalnej i niewerbalnej. Strategie wspierania kontaktów rówieśniczych Twórz bezpieczne, przewidywalne sytuacje społeczne Dzieci z autyzmem lepiej funkcjonują w środowisku, które jest uporządkowane i przewidywalne. Krótkie, jasno zaplanowane zabawy w małych grupach są bardziej skuteczne niż duże, chaotyczne spotkania. Wprowadzaj zabawy strukturalne i scenariusze społeczne Gry planszowe, odgrywanie ról i scenki z życia codziennego pomagają dziecku ćwiczyć współpracę, kolejność wypowiedzi i przestrzeganie prostych zasad społecznych. Modeluj i wyjaśniaj zasady społeczne Pokazuj, jak witać się, prosić o coś, dzielić się zabawkami czy reagować na emocje innych. Możesz używać ilustracji, obrazków lub krótkich historyjek społecznych (social stories). Stopniowo zwiększaj poziom trudności Zacznij od krótkich interakcji jeden na jeden, a potem przechodź do małych grup. Dziecko uczy się w naturalnym tempie, bez presji i poczucia porażki. Ułatwiaj inicjowanie kontaktu Podpowiadaj słowa lub gesty do rozpoczęcia rozmowy. Zachęcaj do zadawania pytań i słuchania odpowiedzi. Wprowadzaj „zadania wspólne”, np. układanie puzzli lub budowanie konstrukcji razem. Doceniaj każdy postęp Nawet krótkie interakcje, uśmiech, czy wspólna zabawa zasługują na pochwałę. Pozytywne wzmocnienie buduje motywację do kolejnych prób kontaktu. Współpracuj ze specjalistami Terapeuta zajęciowy, pedagog specjalny lub psycholog mogą wprowadzić indywidualne ćwiczenia społeczne, które są dopasowane do umiejętności i potrzeb dziecka. Podsumowanie Wsparcie w nawiązywaniu kontaktów rówieśniczych wymaga cierpliwości, konsekwencji i świadomego planowania sytuacji społecznych. Dzięki stopniowemu wprowadzaniu interakcji, modelowaniu zachowań i pozytywnemu wzmocnieniu, dzieci z autyzmem mogą rozwijać przyjaźnie, komunikować się skuteczniej i czerpać radość ze wspólnych zabaw. Wspólne sukcesy budują pewność siebie i poczucie przynależności w grupie.`,
                images: "images/photo22.jpg",
                category: ["koncentracja", "uwaga", "skupienie"],
                author: therapists[1]._id,
            },
            {
                title: "Terapia integracji sensorycznej – co warto wiedzieć?",
                text: `Terapia integracji sensorycznej (SI) jest jedną z najczęściej stosowanych form wsparcia dzieci z autyzmem oraz innymi trudnościami rozwojowymi. Jej celem jest pomoc dziecku w lepszym odbieraniu, przetwarzaniu i reagowaniu na bodźce zmysłowe płynące z otoczenia oraz z własnego ciała. Dzięki odpowiednio dobranym ćwiczeniom dziecko może lepiej funkcjonować w codziennym życiu, uczyć się i nawiązywać relacje z innymi. Czym jest integracja sensoryczna? Integracja sensoryczna to proces, w którym mózg odbiera i organizuje informacje ze zmysłów, takich jak: dotyk, równowaga, propriocepcja (czucie głębokie), wzrok, słuch, węch i smak. U dzieci z zaburzeniami integracji sensorycznej ten proces może przebiegać nieprawidłowo, co prowadzi do nadwrażliwości, podwrażliwości lub trudności w odpowiednim reagowaniu na bodźce. Jakie trudności mogą wskazywać na potrzebę terapii SI? Dziecko może: reagować silnym lękiem lub złością na hałas, dotyk lub światło, unikać niektórych faktur, ubrań lub jedzenia, mieć trudności z koncentracją i spokojnym siedzeniem, poszukiwać intensywnych bodźców (kręcenie się, skakanie, uderzanie), mieć problemy z koordynacją ruchową i planowaniem ruchu, szybko się męczyć lub przeciwnie – być nadmiernie pobudzone. Na czym polega terapia integracji sensorycznej? Terapia SI odbywa się w specjalnie przygotowanej sali wyposażonej w huśtawki, materace, drabinki, piłki i różnorodne pomoce sensoryczne. Zajęcia prowadzi wykwalifikowany terapeuta, który: dostosowuje ćwiczenia do indywidualnych potrzeb dziecka, prowadzi terapię w formie zabawy, stopniowo zwiększa poziom trudności, dba o poczucie bezpieczeństwa i komfort dziecka. Celem terapii nie jest nauka konkretnych umiejętności, lecz poprawa sposobu przetwarzania bodźców, co pośrednio wpływa na rozwój mowy, koncentracji, zachowania i relacji społecznych. Jakie korzyści może przynieść terapia SI? Regularna terapia integracji sensorycznej może: poprawić koncentrację i uwagę, zmniejszyć nadwrażliwość lub potrzebę nadmiernej stymulacji, wspierać rozwój motoryki dużej i małej, pomóc w regulacji emocji,zwiększyć samodzielność dziecka, poprawić komfort funkcjonowania w domu, przedszkolu i szkole. Rola rodziców w terapii SI Rodzice odgrywają kluczową rolę w procesie terapeutycznym. Ważne jest: stosowanie zaleceń terapeuty w domu, wprowadzanie prostych zabaw sensorycznych do codziennych aktywności, obserwowanie reakcji dziecka na różne bodźce, współpraca z terapeutą i innymi specjalistami. Podsumowanie Terapia integracji sensorycznej jest skuteczną formą wsparcia dla dzieci z autyzmem i trudnościami w przetwarzaniu bodźców. Odpowiednio dobrane ćwiczenia, prowadzone w bezpiecznej i przyjaznej atmosferze, pomagają dziecku lepiej rozumieć swoje ciało i otaczający świat. Dzięki temu łatwiej mu się uczyć, komunikować i funkcjonować w codziennych sytuacjach.`,
                images: "images/photo1.jpg",
                category: ["terapia", "nadwrażliwość", "bodźce sensoryczne"],
                author: therapists[1]._id,
            },
            {
                title: "Jak rozumieć i reagować na wybuchy emocji u dzieci?",
                text: `Wybuchy emocji u dzieci z autyzmem są częstym i trudnym doświadczeniem zarówno dla dziecka, jak i jego opiekunów. Krzyk, płacz, agresja lub wycofanie nie są jednak oznaką „złego zachowania”, lecz sygnałem przeciążenia, frustracji lub braku możliwości wyrażenia emocji w inny sposób. Zrozumienie przyczyn takich reakcji jest kluczem do skutecznego i empatycznego wsparcia.

Czym są wybuchy emocji?

Wybuch emocji (tzw. meltdown) to reakcja organizmu na nadmierny stres lub przeciążenie bodźcami. W przeciwieństwie do „napadu złości”, dziecko nie ma pełnej kontroli nad swoim zachowaniem. W tym stanie nie jest w stanie racjonalnie reagować, słuchać poleceń ani wyciszyć się samodzielnie.

Najczęstsze przyczyny wybuchów emocji

Przeciążenie sensoryczne – hałas, światło, dotyk, zapachy

Trudności komunikacyjne – brak możliwości wyrażenia potrzeb lub emocji

Zmiany i brak przewidywalności – nagłe zmiany planów, nowe sytuacje

Zmęczenie lub głód

Zbyt wysokie wymagania niedostosowane do możliwości dziecka

Silne emocje, których dziecko nie potrafi nazwać ani zrozumieć

Jak reagować w trakcie wybuchu emocji?

Zachowaj spokój
Twoja reakcja ma ogromne znaczenie. Spokojny ton głosu i opanowanie pomagają dziecku poczuć się bezpiecznie.

Ogranicz bodźce
Jeśli to możliwe, przenieś dziecko w ciche, spokojne miejsce lub zmniejsz ilość bodźców (światło, dźwięki).

Nie karz i nie pouczaj
W trakcie wybuchu dziecko nie jest w stanie przyswajać informacji ani uczyć się zasad. Karanie może tylko nasilić reakcję.

Używaj krótkich, prostych komunikatów
Jednoznaczne i spokojne komunikaty, np. „Jestem tu”, „Jesteś bezpieczny”, pomagają w regulacji emocji.

Zadbaj o bezpieczeństwo
Jeśli dziecko rzuca przedmiotami lub uderza, usuń potencjalnie niebezpieczne rzeczy i zachowaj dystans, jeśli to konieczne.

Co robić po wybuchu emocji?

Daj dziecku czas na uspokojenie się.

Nazwij emocje, gdy dziecko jest gotowe: „Było ci bardzo trudno”, „Byłeś zdenerwowany”.

Porozmawiaj o tym, co się wydarzyło, w prosty i spokojny sposób.

Wspólnie poszukajcie innych sposobów radzenia sobie w podobnych sytuacjach.

Jak zapobiegać wybuchom emocji?

Wprowadzaj rutynę i przewidywalność

Ucz rozpoznawania emocji (obrazki, skale emocji, historyjki społeczne)

Stosuj przerwy sensoryczne w ciągu dnia

Obserwuj sygnały ostrzegawcze (niepokój, napięcie, wycofanie)

Dostosuj wymagania do aktualnych możliwości dziecka

Współpraca ze specjalistami

Psycholog, terapeuta zajęciowy czy pedagog specjalny mogą pomóc w:

nauce samoregulacji,

tworzeniu indywidualnych strategii wyciszania,

wspieraniu rozwoju emocjonalnego dziecka.

Podsumowanie

Wybuchy emocji u dzieci z autyzmem są formą komunikacji i sygnałem, że dziecko potrzebuje wsparcia. Empatia, spokój i konsekwentne strategie pomagają zmniejszyć ich częstotliwość oraz intensywność. Z czasem dziecko może nauczyć się lepiej rozumieć swoje emocje i radzić sobie z nimi w bezpieczny sposób.`,
                images: "images/photo14.jpg",
                category: ["emocje", "samoregulacja", "wybuchy emocji"],
                author: therapists[1]._id,
            },
             {
                title: "Techniki samoregulacji dla dzieci z autyzmem",
                text: `Techniki samoregulacji dla dzieci z autyzmem

Samoregulacja to zdolność rozpoznawania, rozumienia i kontrolowania własnych emocji, reakcji oraz poziomu pobudzenia. Dla dzieci z autyzmem jest to szczególnie trudne, ponieważ często doświadczają one silnych emocji, przeciążenia sensorycznego oraz problemów z komunikacją. Nauka samoregulacji pomaga dzieciom lepiej radzić sobie z codziennymi wyzwaniami, zmniejsza liczbę wybuchów emocji i zwiększa poczucie bezpieczeństwa.

Czym jest samoregulacja?

Samoregulacja to proces, w którym dziecko uczy się:

rozpoznawać sygnały płynące z ciała i emocji,

reagować w sposób adekwatny do sytuacji,

wyciszać się po stresujących doświadczeniach,

stopniowo odzyskiwać kontrolę nad swoim zachowaniem.

U dzieci z autyzmem umiejętność ta często wymaga świadomego, długoterminowego wsparcia.

Dlaczego samoregulacja jest trudna?

Nadwrażliwość lub podwrażliwość sensoryczna

Trudności w nazywaniu i rozumieniu emocji

Niskie poczucie kontroli w sytuacjach społecznych

Nagłe zmiany i brak przewidywalności

Ograniczone strategie radzenia sobie ze stresem

Skuteczne techniki samoregulacji
1. Techniki oddechowe

Proste ćwiczenia oddechowe pomagają obniżyć napięcie:

wolne wdechy nosem i wydechy ustami,

„dmuchanie świeczki” lub baniek mydlanych,

liczenie oddechów razem z dorosłym.

2. Przerwy sensoryczne

Krótkie przerwy w ciągu dnia pozwalają dziecku się wyregulować:

skakanie, huśtanie się, turlanie,

ugniatanie piłek sensorycznych,

korzystanie z koca obciążeniowego (zgodnie z zaleceniami specjalisty).

3. Wizualne narzędzia regulacji

skale emocji (np. od 1 do 5),

karty emocji,

plany dnia z zaznaczonym czasem na odpoczynek.

4. Stała rutyna i przewidywalność

Powtarzalność daje dziecku poczucie bezpieczeństwa i kontroli:

podobny plan dnia,

zapowiedzi zmian z wyprzedzeniem,

jasne i krótkie instrukcje.

5. Nauka nazywania emocji

Pomagaj dziecku rozpoznawać i nazywać emocje:

„Widzę, że jesteś zdenerwowany”,

„Twoje ciało jest bardzo napięte”,

korzystaj z książek i obrazków przedstawiających emocje.

6. Kącik wyciszenia

Stworzenie spokojnego miejsca w domu lub szkole:

miękkie poduszki, słuchawki wygłuszające,

ulubione przedmioty,

ograniczone bodźce dźwiękowe i świetlne.

7. Modelowanie przez dorosłych

Dzieci uczą się poprzez obserwację:

pokazuj, jak Ty się uspokajasz,

mów na głos o swoich emocjach,

demonstruj spokojne reakcje w trudnych sytuacjach.

Rola dorosłych w nauce samoregulacji

Dorosły pełni funkcję „zewnętrznego regulatora”, który:

pomaga dziecku wyciszyć się,

nazywa emocje,

pokazuje strategie radzenia sobie,

stopniowo oddaje dziecku kontrolę nad emocjami.

Proces ten wymaga czasu, cierpliwości i konsekwencji.

Podsumowanie

Techniki samoregulacji są kluczowym elementem wspierania dzieci z autyzmem. Dzięki prostym, regularnie stosowanym strategiom dzieci mogą stopniowo uczyć się rozpoznawania własnych emocji, wyciszania organizmu i radzenia sobie ze stresem. Odpowiednie wsparcie dorosłych oraz przewidywalne środowisko pomagają budować poczucie bezpieczeństwa i samodzielności emocjonalnej dziecka.`,
                images: "images/photo7.jpg",
                category: ["emocje", "samoregulacja"],
                author: therapists[1]._id,
            },
              {
                title: "Jak wybrać odpowiednią szkołę lub przedszkole?",
                text: `Wybór odpowiedniej placówki edukacyjnej to jedna z najważniejszych decyzji, jaką podejmują rodzice dzieci z autyzmem. Odpowiednia szkoła lub przedszkole wspiera rozwój dziecka, rozumie jego potrzeby i tworzy bezpieczne środowisko, w którym może się uczyć, komunikować i nawiązywać relacje. Nie chodzi tylko o zapewnienie opieki — chodzi o dostosowanie edukacji do indywidualnych potrzeb dziecka.

Co jest najważniejsze przy wyborze?
1. Indywidualne podejście

Dobre przedszkole/szkoła:

tworzy Indywidualny Program Edukacyjno-Terapeutyczny (IPET),

dostosowuje metody i tempo nauki do umiejętności dziecka,

traktuje postępy dziecka holistycznie — zarówno społeczne, jak i edukacyjne.

2. Kompetencje i doświadczenie zespołu

Zapytaj:

czy kadra zna zagadnienia dotyczące autyzmu,

czy nauczyciele/terapeuci mają doświadczenie w pracy z dziećmi ze spektrum,

czy dostępne są szkolenia i superwizje.

Zespół dobrze przygotowany to zespół bezpieczny dla dziecka.

3. Wielkość grupy i struktura zajęć

Mniejsze grupy zazwyczaj sprzyjają:

lepszej koncentracji,

indywidualnej uwadze,

mniej stresujących sytuacji sensorycznych.

Struktura dnia powinna być:

przewidywalna,

jasno przedstawiona dziecku (np. za pomocą harmonogramu obrazkowego).

4. Dostosowanie środowiska

Warto sprawdzić, czy placówka:

posiada strefy sensoryczne lub miejsca do wyciszenia,

eliminuje nadmierne bodźce (hałas, jaskrawe światło),

oferuje sprzęt terapeutyczny (materace, piłki, huśtawki).

Jakie pytania warto zadać przed podjęciem decyzji?

Oto praktyczna lista:

O kompetencjach i metodach:

Jakie metody edukacyjne i terapeutyczne są stosowane?

Czy nauczyciele i terapeuci mają doświadczenie w pracy z autyzmem?

Jak wygląda współpraca z logopedą, pedagogiem lub psychologiem?

O indywidualne wsparcie:

Czy dziecko ma opracowany IPET?

Jak monitorowane są postępy dziecka?

Jakie są narzędzia komunikacyjne stosowane w klasie (np. PECS, aplikacje)?

O środowisko i rutynę:

Jak wygląda typowy dzień dziecka?

Czy plan zajęć jest przedstawiany w formie wizualnej?

Jak wygląda przerwa/posiłek? Czy są zasady ułatwiające uczestnictwo dziecka?

Współpraca między domem a placówką

Ważne, aby:

istniał stały kanał komunikacji między rodzicami a nauczycielami,

rodzice byli informowani o postępach i trudnościach,

szkoła i rodzina wspólnie ustalały cele edukacyjne i terapeutyczne.

Co jeszcze warto sprawdzić?
Znajomość metod alternatywnej komunikacji

Nie każda placówka musi mieć od razu ekspertów, ale powinna być otwarta na:

PECS,

gesty,

urządzenia wspomagające komunikację.

Gotowość na adaptacje i zmiany

Placówka, która:

obserwuje dziecko,

wprowadza modyfikacje,

jest elastyczna — jest miejscem przyjaznym dla rozwoju.

Emocjonalne i społeczne wsparcie

Sprawdź, czy szkoła/przedszkole:

organizuje zajęcia społeczne,

wspiera nawiązywanie kontaktów między dziećmi,

ma procedury reagowania na trudne sytuacje.

Podsumowanie

Wybór odpowiedniej szkoły lub przedszkola to proces, który wymaga czasu, obserwacji i zadawania właściwych pytań. Najlepsza placówka to taka, która:

✔ traktuje Twoje dziecko indywidualnie,
✔ tworzy przewidywalne i bezpieczne środowisko,
✔ współpracuje z rodzicami i specjalistami,
✔ dostosowuje metody nauki do potrzeb dziecka.`,
                images: "images/photo8.jpg",
                category: ["edukacja", "szkoła", "rozwój"],
                author: therapists[1]._id,
            },


        ]);

        const todayMorning = new Date();
        todayMorning.setHours(8, 0, 0, 0);

        const todayMorning2 = new Date();
        todayMorning2.setHours(8, 15, 0, 0);

        const todayMorning3 = new Date();
        todayMorning3.setHours(8, 19, 0, 0);


        const messages = await Message.insertMany([
            {
                from: therapists[0]._id,
                to: parents[0]._id,
                content: "Dzień dobry",
                timestamp: todayMorning,
                read: true
            },

            {
                to: therapists[0]._id,
                from: parents[0]._id,
                content: "Witam",
                timestamp: todayMorning2,
                read: true
            },

            {
                from: therapists[0]._id,
                to: parents[0]._id,
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan libero ut mauris sodales lacinia. ",
                timestamp: todayMorning3,
                read: false
            }

        ]);





        console.log("Database seeded successfully!");
        console.log({
            parentsCount: parents.length,
            childrenCount: children.length,
            therapistsCount: therapists.length,
            tasksCount: tasks.length,
            articlesCount: articles.length,
            userTasksCount: userTasks.length,
            messagesCount: messages.length,
            chaptersCount: chapters.length,
            blocksCount: blocks.length
        });

        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

seedDatabase();
