const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Base URL for the API

export const addColumn = async (boardId, columns, setColumns) => {
  try {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    const response = await fetch(`${API_BASE_URL}/api/boards/${boardId}/columns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the token in the headers
      },
      body: JSON.stringify({ title: "", order: columns.length })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to create column: ${errorText}`);
      throw new Error(`Failed to create column: ${errorText}`);
    }

    const newColumn = await response.json();
    setColumns([...columns, { ...newColumn, isEditing: true, cards: [], newCardText: "", isAddingCard: false }]);
  } catch (error) {
    console.error('Failed to create column:', error);
  }
};

export const renameColumn = async (boardId, columns, setColumns, columnId, newTitle) => {
  try {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    const response = await fetch(`${API_BASE_URL}/api/boards/${boardId}/columns/${columnId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the token in the headers
      },
      body: JSON.stringify({ title: newTitle })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to rename column: ${errorText}`);
      throw new Error(`Failed to rename column: ${errorText}`);
    }

    const updatedColumn = await response.json();
    setColumns(columns.map((col) => (col.id === columnId ? { ...col, title: updatedColumn.title } : col)));
  } catch (error) {
    console.error('Failed to rename column:', error);
  }
};

export const finalizeColumnTitle = (columns, setColumns, columnId) => {
  setColumns(
    columns.map((col) =>
      col.id === columnId && col.title.trim()
        ? { ...col, isEditing: false }
        : col
    )
  );
};

export const deleteColumn = async (boardId, columns, setColumns, columnId) => {
  try {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    const response = await fetch(`${API_BASE_URL}/api/boards/${boardId}/columns/${columnId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` // Include the token in the headers
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to delete column: ${errorText}`);
      throw new Error(`Failed to delete column: ${errorText}`);
    }

    setColumns(columns.filter((col) => col.id !== columnId).map((col, index) => ({ ...col, order: index })));
  } catch (error) {
    console.error('Failed to delete column:', error);
  }
};

export const handleColumnDragStart = (event, columnId, setDraggingColumn) => {
  setDraggingColumn(columnId);
  event.dataTransfer.effectAllowed = "move";
};

export const handleDrop = (event, targetColumnId, draggingColumn, columns, setColumns) => {
  event.preventDefault();
  if (draggingColumn && draggingColumn !== targetColumnId) {
    const updatedColumns = [...columns];
    const draggedColumnIndex = updatedColumns.findIndex((col) => col.id === draggingColumn);
    const targetColumnIndex = updatedColumns.findIndex((col) => col.id === targetColumnId);

    const [draggedColumn] = updatedColumns.splice(draggedColumnIndex, 1);
    updatedColumns.splice(targetColumnIndex, 0, draggedColumn);

    setColumns(updatedColumns.map((col, index) => ({ ...col, order: index })));
  }
};

export const addCard = (columns, setColumns, columnId) => {
  setColumns(
    columns.map((col) => {
      if (col.id === columnId && col.newCardText.trim()) {
        return {
          ...col,
          cards: [...col.cards, { id: Date.now(), text: col.newCardText, checked: false }],
          newCardText: "",
          isAddingCard: false,
        };
      }
      return col;
    })
  );
};

export const removeCard = (columns, setColumns, columnId, cardId) => {
  setColumns(
    columns.map((col) => {
      if (col.id === columnId) {
        return { ...col, cards: col.cards.filter((card) => card.id !== cardId) };
      }
      return col;
    })
  );
};

export const handleCardInputChange = (columns, setColumns, columnId, text) => {
  setColumns(
    columns.map((col) => (col.id === columnId ? { ...col, newCardText: text } : col))
  );
};

export const handleCardInputKeyPress = (event, columnId, columns, setColumns) => {
  if (event.key === "Enter") {
    addCard(columns, setColumns, columnId);
  }
};

export const handleCardDragStart = (event, cardId, columnId, setDraggingCard) => {
  setDraggingCard({ cardId, columnId });
  event.dataTransfer.effectAllowed = "move";
};

export const handleDrop = (event, targetColumnId, draggingCard, columns, setColumns, setDraggingCard) => {
  event.preventDefault();
  const { cardId, columnId } = draggingCard;
  if (cardId && columnId !== targetColumnId) {
    setColumns(
      columns.map((col) => {
        if (col.id === columnId) {
          return { ...col, cards: col.cards.filter((card) => card.id !== cardId) };
        }
        if (col.id === targetColumnId) {
          const movedCard = columns
            .find((col) => col.id === columnId)
            .cards.find((card) => card.id === cardId);
          return { ...col, cards: [...col.cards, movedCard] };
        }
        return col;
      })
    );
  }
  setDraggingCard(null);
};

export const handleTrashDrop = (event, draggingCard, columns, setColumns, setDraggingCard) => {
  event.preventDefault();
  const { cardId, columnId } = draggingCard;
  if (cardId && columnId) {
    setColumns(
      columns.map((col) => {
        if (col.id === columnId) {
          return { ...col, cards: col.cards.filter((card) => card.id !== cardId) };
        }
        return col;
      })
    );
  }
  setDraggingCard(null);
};

export const handleCheckboxChange = (columnId, cardId, checked, setColumns) => {
  setColumns((prevColumns) =>
    prevColumns.map((col) =>
      col.id === columnId
        ? {
          ...col,
          cards: col.cards.map((card) =>
            card.id === cardId ? { ...card, checked: checked } : card
          ),
        }
        : col
    )
  );
};