import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import logo from "./assets/logo.png";
function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const [search, setSearch] = useState("");

  const getAllThreads = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://sigmaai-0qcu.onrender.com/api/thread", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      //console.log(filteredData);
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://sigmaai-0qcu.onrender.com/api/thread/${newThreadId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://sigmaai-0qcu.onrender.com/api/thread/${threadId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const res = await response.json();
      console.log(res);

      //updated threads re-render
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId),
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        
        <img src={logo} alt="SigmaAI" className="logo" />

          <i className="fa-solid fa-pen-to-square"></i>
      </button>

      <div className="searchBox">
        <input
          type="text"
          placeholder="🔍 Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className="history">
        {allThreads
          ?.filter((thread) =>
            thread.title.toLowerCase().includes(search.toLowerCase()),
          )
          .map((thread, idx) => (
            <li
              key={idx}
              onClick={(e) => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "highlighted" : " "}
            >
              {thread.title}
              <i
                className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation(); //stop event bubbling
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
      </ul>

      <div className="sign">
        <p>By Govind Chandna &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;
