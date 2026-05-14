import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../auth/useAuth";
import ButtonAmberButton from "../components/ButtonAmberButton";
import Spinner from "../components/Spinner";
import SettingsPopup from "../components/SettingsPopup";
import { useNavigate } from "react-router-dom";
import AccountFormPopup from '../components/AccountFormPopup'

export default function TherapistSettings() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [popup, setPopup] = useState({ type: null, data: null });
    const [parents, setParents] = useState()
    const [code, setCode] = useState()
    const { logout } = useAuth();


    function openPopup(type, data = null) {
        setPopup({ type, data });
    }
    function closePopup() {
        setPopup({ type: null, data: null });
    }
    async function disconnect(userId) {
        await api.post(`/users/disconnect`, { userId })
        fetchParents()
    }

    async function fetchParents() {
        const res = await api.get(`/users/therapist/${user}/children/`);
        setParents(res.data);
    }
    async function fetchCode() {
        const res = await api.post(`/users/therapistCode`, { user })
        setCode(res.data.code)
    }

    useEffect(() => {
        fetchParents();
        fetchCode();
    }, [user]);


    if (!parents) return <Spinner />;

    async function handleSaveAccount(data) {
        await api.put(`/users/${user}`, data);

        closePopup();
    }
    async function deleteAccount() {
 
        if (!confirm("Czy na pewno chcesz usunąć swoje konto?")) return;
        try {
            await api.delete(`/users/${user}`);
            alert("Konto zostało pomyślnie usunięte.");
            logout();
            navigate("/")
        } catch (error) {
            console.error("Błąd podczas usuwania konta:", error);
            alert("Nie udało się usunąć konta. Spróbuj ponownie później.");
        }
    }

    return (
        <>
            <Nav />
            <h1 className="text-4xl text-blue-950 m-5 text-center">Dane konta</h1>
            <main className="p-5 lg:w-9/10 lg:mx-auto flex flex-col lg:flex-row gap-8 sm:w-7/10 sm:mx-auto lg:flex-wrap lg:justify-center" >

                <section className="w-full bg-white shadow-[0px_0px_30px_-19px_rgba(66,68,90,1)] rounded-4xl p-5 text-center lg:flex lg:flex-col lg:justify-between lg:min-w-50 lg:max-w-120">
                    <h3 className="text-xl font-semibold text-blue-950 mb-3">Dane konta</h3>
                    <p className="mb-5 text-blue-950">Zarządzaj podstawowymi informacjami o koncie.</p>
                    <div className="lg:flex lg:justify-center lg:mt-auto lg:gap-2">
                        <ButtonAmberButton text="Edytuj dane konta" func={() => openPopup("editAccount")} />
                             <ButtonAmberButton text="Usuń konto" func={deleteAccount} />
                    </div>
                </section>

                <section className="w-full bg-white shadow-[0px_0px_30px_-19px_rgba(66,68,90,1)] rounded-4xl p-5 text-center lg:flex lg:flex-col lg:justify-between lg:min-w-50 lg:max-w-120">
                    <h3 className="text-xl font-semibold text-blue-950 mb-3">Połączeni rodzice</h3>
                    <p className="mb-5 text-blue-950">Lista połączonych rodziców i ich dzieci</p>
                    <div className=" w-full flex flex-col justify-between lg:mt-auto">
                        {parents.length == 0 ? <p className="text-center mx-auto text-gray-500">Brak połączeń</p> :
                            parents.map(parent => (
                                <div key={parent.parentId} className="flex w-full items-start gap-4 justify-center mb-3">
                                    <div className="flex-3">

                                        <p className="text-left text-blue-950 text-lg flex-1 font-semibold">{parent.parentName}:</p>
                                        <ul className="list-disc list-inside">
                                            {parent.child.map(singleChild => (
                                                <li key={singleChild.name} className="text-left text-blue-950 text-lg flex-1"> {singleChild.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <ButtonAmberButton text="Rozłącz" className="flex-1" func={() => disconnect(parent.parentId)} />
                                </div>
                            ))
                        }

                    </div>
                </section>

                <section className="w-full bg-white shadow-[0px_0px_30px_-19px_rgba(66,68,90,1)] rounded-4xl p-5 text-center lg:flex lg:flex-col lg:min-w-50 lg:max-w-120">
                    <h3 className="text-xl font-semibold text-blue-950 mb-3">Twój kod połączneia</h3>

                    <p className="text-xl font-semibold my-auto">{code}</p>
                </section>

            </main>

            {popup.type && (
                <SettingsPopup onClose={closePopup}>


                    {popup.type === "editAccount" && (
                        <AccountFormPopup
                            user={user}
                            onClose={closePopup}
                            onSave={handleSaveAccount}
                        />
                    )}

                </SettingsPopup>
            )}
        </>
    );
}
