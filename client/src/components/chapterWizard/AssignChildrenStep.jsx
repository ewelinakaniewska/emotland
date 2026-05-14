import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../auth/useAuth";
import ButtonBlueButton from "../ButtonBlueButton";
import ButtonAmberButton from "../ButtonAmberButton";

export default function AssignChildrenStep({
  chapter,
  setChapter,
  onNext,
  onPrev
}) {
  const { user } = useAuth();
  const [parents, setParents] = useState([]);
  const [selectedIds, setSelectedIds] = useState(
    chapter.assignedChildren || []
  );

  useEffect(() => {
    if (!user) return;

    const fetchChildren = async () => {
      const res = await api.get(`/users/therapist/${user}/children`);
      setParents(res.data);
    };

    fetchChildren();
  }, [user]);

  useEffect(() => {
    setSelectedIds(chapter.assignedChildren || []);
  }, [chapter.assignedChildren]);

  const toggleChild = childId => {
    setSelectedIds(prev =>
      prev.includes(childId)
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    );
  };

  const handleNext = () => {
    if (!selectedIds.length) {
      alert("Wybierz przynajmniej jedno dziecko");
      return;
    }

    setChapter(prev => ({
      ...prev,
      assignedChildren: selectedIds
    }));

    onNext();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-950 mb-3">
        Przypisz dzieci
      </h2>

      <div className="bg-white rounded-4xl p-5 shadow">
        {parents.map(parent => (
          <div key={parent.parentId} className="mb-4">
            <p className="font-semibold text-blue-900 mb-2">
              {parent.parentName}
            </p>

            {parent.child.map(child => {
              const selected = selectedIds.includes(child._id);

              return (
                <div
                  key={child._id}
                  className={`cursor-pointer px-3 py-1 rounded
                    ${selected ? "bg-amber-200" : "hover:bg-amber-50"}
                  `}
                  onClick={() => toggleChild(child._id)}
                >
                  {child.name}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4 lg:justify-between">
        <ButtonBlueButton func={onPrev} text="Wstecz" />
        <ButtonAmberButton func={handleNext} text="Dalej" />
      </div>
    </div>
  );
}
