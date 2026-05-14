import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../auth/useAuth";
import ButtonAmberButton from "../components/ButtonAmberButton";
import Spinner from "../components/Spinner";
import SettingsPopup from "../components/SettingsPopup";
import AccountFormPopup from '../components/AccountFormPopup'
import ChildFormPopup from "../components/ChildFormPopup";
import TherapistPopup from "../components/TherapistPopup";
import { useNavigate } from "react-router-dom";
import ButtonBlueButton from "../components/ButtonBlueButton";

export default function Settings() {
    const { user } = useAuth();
    const [children, setChildren] = useState(null);
    const [popup, setPopup] = useState({ type: null, data: null });
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [therapist, setTherapist] = useState(null);
    const [hasTherapist, setHasTherapist] = useState(false);

    function openPopup(type, data = null) {
        setPopup({ type, data });
    }
    function closePopup() {
        setPopup({ type: null, data: null });
    }

    async function disconnectTherapist() {
        await api.post(`/users/disconnect`, { userId: user });
        closePopup();
        fetchTherapist();
    }

    useEffect(() => {
        async function fetchChildren() {
            const res = await api.get(`/users/children/${user}`);
            setChildren(res.data);
        }
        fetchChildren();
    }, [user]);

    useEffect(() => {
        fetchTherapist();
    }, [user]);


    async function fetchTherapist() {
        const res = await api.get(`/users/${user}/therapist`);
        setHasTherapist(res.data.hasTherapist);
        setTherapist(res.data.therapist);
    }
    if (!children) return <Spinner />;


    async function deleteChild(id) {
        if (!confirm("Czy na pewno chcesz usunąć to konto dziecka?")) return;
        await api.delete(`/users/child/${id}`);
        setChildren(prev => prev.filter(c => c._id !== id));
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


    async function handleSaveChild(data) {
        const payload = {
            firstName: data.childFirstName,
            name: data.childName,
            age: data.childAge,
            password: data.childPassword
        };

        if (popup.type === "editChild") {
            await api.put(`/users/${data.childId}`, payload);
            setChildren(prev => prev.map(c => (c._id === data.childId ? { ...c, ...payload } : c)));
        } else if (popup.type === "addChild") {
            const res = await api.post(`/users`, { parentId: user, role: "child", ...payload });
            setChildren(prev => [...prev, res.data]);
        }

        closePopup();
    }


    async function handleSaveAccount(data) {
        await api.put(`/users/${user}`, data);

        closePopup();
    }

    async function handleConnectTherapist(code) {
        await api.post(`/users/connect`, { userId: user, code });
        closePopup();
        fetchTherapist();
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

                <section className="w-full bg-white shadow-[0px_0px_30px_-19px_rgba(66,68,90,1)] rounded-4xl p-5 text-center lg:min-w-50 lg:max-w-120">
                    <h3 className="text-xl font-semibold text-blue-950 mb-5">Twoje dzieci</h3>
                    {children.map(child => (
                        <div key={child._id} className="flex items-center justify-between mb-3">
                            <p className="text-left text-blue-950 text-lg flex-1">{child.name}</p>
                            <div className="flex gap-2">
                                <ButtonBlueButton text="Edytuj" func={() => openPopup("editChild", child)} />
                                <ButtonBlueButton text="Usuń" func={() => deleteChild(child._id)} />
                            </div>
                        </div>
                    ))}
                    <div className="mt-7 lg:flex lg:justify-end">
                        <ButtonAmberButton text="Dodaj dziecko" func={() => openPopup("addChild")} />
                    </div>
                </section>

                {!hasTherapist ? (
                    <section className="w-full bg-white shadow-[0px_0px_30px_-19px_rgba(66,68,90,1)] rounded-4xl p-5 text-center lg:flex lg:flex-col lg:justify-between lg:min-w-50 lg:max-w-120">
                        <h3 className="text-xl font-semibold text-blue-950 mb-3">Połącz z terapeutą</h3>
                        <p className="mb-5 text-blue-950">Wprowadź kod terapeuty, aby połączyć konto.</p>
                        <div className="lg:flex lg:justify-center lg:mt-auto">

                            <ButtonAmberButton text="Wprowadź kod" func={() => openPopup("therapist")} />
                        </div>
                    </section>
                ) : (
                    <section className="w-full bg-white shadow-[0px_0px_30px_-19px_rgba(66,68,90,1)] rounded-4xl p-5 text-center lg:flex lg:flex-col lg:justify-between lg:min-w-50 lg:max-w-100">
                        <h3 className="text-xl font-semibold text-blue-950 mb-3">Twój terapeuta</h3>
                        <p className="text-blue-950">{therapist.firstName} {therapist.lastName}</p>
                        <p className="text-blue-950">{therapist.email}</p>
                        <div className="lg:flex lg:justify-end lg:mt-auto">

                            <ButtonAmberButton text="Rozłącz" func={disconnectTherapist} />
                        </div>

                    </section>
                )}

            </main>

            {popup.type && (
                <SettingsPopup onClose={closePopup}>
                    {popup.type === "editChild" && (
                        <ChildFormPopup
                            child={popup.data}
                            onClose={closePopup}
                            onSave={handleSaveChild}
                        />
                    )}
                    {popup.type === "addChild" && (
                        <ChildFormPopup
                            onClose={closePopup}
                            onSave={handleSaveChild}
                        />
                    )}
                    {popup.type === "editAccount" && (
                        <AccountFormPopup
                            user={user}
                            onClose={closePopup}
                            onSave={handleSaveAccount}
                        />
                    )}
                    {popup.type === "therapist" && (
                        <TherapistPopup
                            onClose={closePopup}
                            onSave={handleConnectTherapist}
                        />
                    )}
                </SettingsPopup>
            )}
        </>
    );
}
