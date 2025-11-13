import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { socket } from "../socket";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from "./BoardPage.module.css";

export default function BoardPage() {
  const { id: boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");

  // Socket.io real-time sync
  useEffect(() => {
    socket.emit("joinBoard", boardId);

    socket.on("cardMoved", (data) => {
      setLists((prevLists) => {
        const newLists = [...prevLists];
        const sourceList = newLists.find(
          (l) => l._id === data.source.droppableId
        );
        const destList = newLists.find(
          (l) => l._id === data.destination.droppableId
        );

        if (sourceList && destList) {
          const [movedCard] = sourceList.cards.splice(data.source.index, 1);
          destList.cards.splice(data.destination.index, 0, movedCard);
        }
        return newLists;
      });
    });

    return () => socket.off("cardMoved");
  }, [boardId]);

  // Fetch board & lists
  useEffect(() => {
    fetchBoard();
    fetchLists();
  }, [boardId]);

  const fetchBoard = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/boards/${boardId}`, {
      withCredentials: true,
    });
    setBoard(res.data);
  };

  const fetchLists = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/boards/${boardId}/lists`,
      { withCredentials: true }
    );
    const listsWithCards = await Promise.all(
      res.data.map(async (list) => {
        const cardsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/boards/${boardId}/lists/${list._id}/cards`,
          { withCredentials: true }
        );
        return { ...list, cards: cardsRes.data };
      })
    );
    setLists(listsWithCards);
  };

  const createList = async () => {
    if (!newListTitle.trim()) return;
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/boards/${boardId}/lists`,
      { title: newListTitle },
      { withCredentials: true }
    );
    setLists([...lists, { ...res.data, cards: [] }]);
    setNewListTitle("");
  };

  const createCard = async (listId) => {
    const title = prompt("Card title:");
    if (!title?.trim()) return;
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/boards/${boardId}/lists/${listId}/cards`,
      { title },
      { withCredentials: true }
    );
    setLists(
      lists.map((list) =>
        list._id === listId
          ? { ...list, cards: [...list.cards, res.data] }
          : list
      )
    );
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceList = lists.find((l) => l._id === source.droppableId);
    const destList = lists.find((l) => l._id === destination.droppableId);
    const card = sourceList.cards[source.index];

    // Optimistic UI Update
    const newLists = [...lists];
    newLists
      .find((l) => l._id === source.droppableId)
      .cards.splice(source.index, 1);
    newLists
      .find((l) => l._id === destination.droppableId)
      .cards.splice(destination.index, 0, card);
    setLists(newLists);

    // Save to DB
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/boards/${boardId}/lists/${destination.droppableId}/cards/${draggableId}`,
        { listId: destination.droppableId, position: destination.index },
        { withCredentials: true }
      );

      // Emit real-time
      socket.emit("cardMove", { boardId, source, destination, card });
    } catch (err) {
      alert("Failed to save. Reverting...");
      fetchLists();
    }
  };

  return (<>
    <div className={styles.flexx}>
      <div className={styles.header}>
        <h1 className={styles.title}>{board?.title || "Loading..."}</h1>
      </div>
      <div className={styles.addListSection}>
        <div className={styles.addListBox}>
          <input
            type="text"
            placeholder="Add another list"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            className={styles.addListInput}
          />
          <button onClick={createList} className={styles.addListBtn}>
            Add List
          </button>
        </div>
      </div></div>
    <div className={styles.container}>
      
      <div className={styles.boardContent}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={styles.listsContainer}>
            {lists.map((list) => (
              <div key={list._id} className={styles.listWrapper}>
                <div className={styles.list}>
                  <h3 className={styles.listTitle}>{list.title}</h3>

                  <Droppable droppableId={list._id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={styles.cardsContainer}
                      >
                        {list.cards.map((card, index) => (
                          <Draggable
                            key={card._id}
                            draggableId={card._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={styles.card}
                                style={{
                                  ...provided.draggableProps.style,
                                }}
                              >
                                {card.title}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  <button
                    onClick={() => createCard(list._id)}
                    className={styles.addCardBtn}
                  >
                    + Add a card
                  </button>
                </div>
              </div>
            ))}

            {/* Add List */}
          </div>
        </DragDropContext>
      </div>
    </div></>
  );
}
