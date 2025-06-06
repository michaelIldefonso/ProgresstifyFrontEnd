import { useRef, useEffect, memo } from "react";
import { Box, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import Column from "./Column";
import { handleAddColumn, handleColumnsScroll, getColumns } from "../BoardFunctions/columnFunctions";
import PropTypes from "prop-types"; // Import PropTypes

const ColumnList = memo(({ id, columns, setColumns, draggingCard, setDraggingCard, draggingColumn, setDraggingColumn, darkMode }) => {
  const columnsContainerRef = useRef(null);
  const scrollbarRef = useRef(null);
  const columnsFetchedRef = useRef(false); // Ensure this is initialized

  useEffect(() => {
    getColumns(id, setColumns, columnsFetchedRef); // Pass the initialized ref
  }, [id, setColumns]);

  return (
    <Box sx={{ flexGrow: 1, padding: 3, marginTop: "140px", transition: "margin-left 0.3s",
      
     }}>
      <div style={{ height: "calc(100% - 60px)" }}>
        <Box
          sx={{
            position: "fixed",
            top: "120px",
            zIndex: 1200,
            transition: "left 0.3s",
          }}
        >
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleAddColumn(id, columns, setColumns, columnsContainerRef)}
            sx={{ 
                 borderRadius: "24px", 
                 marginLeft: "24px",
                 backgroundColor: darkMode ? "rgb(9, 137, 241)" : "rgb(241, 128, 41)",
               }}
          >
            Add Column
          </Button>
        </Box>
        <Box
          ref={columnsContainerRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            height: "100%",
            paddingTop: 2,
            "&::-webkit-scrollbar": { display: "none" },
            "msOverflowStyle": "none",
            "scrollbarWidth": "none",
            
          }}
          onScroll={(e) => handleColumnsScroll(e, scrollbarRef)}
        >
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              id={id}
              columns={columns}
              setColumns={setColumns}
              draggingCard={draggingCard}
              setDraggingCard={setDraggingCard}
              draggingColumn={draggingColumn}
              setDraggingColumn={setDraggingColumn}
              darkMode={darkMode}
            />
          ))}
        </Box>
      </div>
    </Box>
  );
});

// Add displayName for the memo-wrapped component
ColumnList.displayName = "ColumnList";

// Add PropTypes for validation
ColumnList.propTypes = {
  id: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  setColumns: PropTypes.func.isRequired,
  draggingCard: PropTypes.object,
  setDraggingCard: PropTypes.func,
  draggingColumn: PropTypes.object,
  setDraggingColumn: PropTypes.func,
  darkMode: PropTypes.bool.isRequired,
};

export default ColumnList;