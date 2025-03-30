import { useEffect, useState, useRef } from "react";
import "./styles.css";

const Pill = ({ name, image, onclick }) => {
  return (
    <div className="pill">
      <span className="pill-title">
        <img src={image} alt="" />
        <span>{name}</span>
      </span>
      <span className="pill-remove" onClick={onclick}>
        X
      </span>
    </div>
  );
};

export default function App() {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const inputRef = useRef();
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  useEffect(() => {
    function fetchUser() {
      if (searchText.length === 0) {
        setUsers([]);
        return;
      }
      fetch(`https://dummyjson.com/users/search?q=${searchText}`)
        .then((res) => res.json())
        .then((res) => setUsers(res?.users));
    }

    fetchUser();
  }, [searchText]);

  function handleUserSelect(user) {
    setSelectedUsers((prev) => [...prev, user]);
    setUsers((prev) => prev.filter((u) => u !== user));
    setActiveSuggestion(-1);
    inputRef.current.focus();
  }

  function handlerUserRemove(user) {
    setSelectedUsers((prev) => prev.filter((u) => u.email !== user.email));
    setUsers((prev) => [...prev, user]);
  }

  function handleKeyDown(e) {
    if (e.key === "Backspace" && !e.target.value && selectedUsers.length > 0) {
      handlerUserRemove(selectedUsers[selectedUsers.length - 1]);
    } else if (e.key === "ArrowUp") {
      setActiveSuggestion((prev) => (prev <= 0 ? users.length - 1 : prev - 1));
    } else if (e.key === "ArrowDown") {
      setActiveSuggestion((prev) => (prev < users.length - 1 ? prev + 1 : 0));
    } else if (e.key === "Enter") {
      const user = users[activeSuggestion];
      if (user) {
        handleUserSelect(user);
      }
    }
  }

  return (
    <div className="App">
      <div className="user-search-container">
        <div className="user-search-input">
          {selectedUsers.map((user) => {
            const name = user?.firstName + "" + user?.lastName;
            return (
              <Pill
                key={user.email}
                name={name}
                image={user?.image}
                onclick={() => handlerUserRemove(user)}
              />
            );
          })}

          <input
            type="text"
            placeholder="search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            ref={inputRef}
            onKeyDown={handleKeyDown}
          />
        </div>

        <ul
          className={`suggested-user-list ${
            users.length === 0 || users.length === selectedUsers.length
              ? "empty"
              : ""
          }`}
        >
          {users.map((user, index) => {
            const isSelected = selectedUsers.some(
              (u) => u.email === user.email
            );
            return !isSelected ? (
              <li
                key={user.email}
                onClick={() => handleUserSelect(user)}
                className={`${activeSuggestion === index ? "active" : ""}`}
              >
                <img src={user.image} alt="" />
                <span>
                  {user.firstName} {user.lastName}
                </span>
              </li>
            ) : null;
          })}
        </ul>
      </div>
    </div>
  );
}
