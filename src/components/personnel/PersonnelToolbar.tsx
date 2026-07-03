type Props = {
  search: string;
  setSearch: (value: string) => void;
  onCreate: () => void;
};

export default function PersonnelToolbar({ search, setSearch, onCreate }: Props) {
  return (
    <div className="personnelToolbar">
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Personel ara..."
      />

      <button className="newButton" onClick={onCreate}>
        + Yeni Personel
      </button>
    </div>
  );
}