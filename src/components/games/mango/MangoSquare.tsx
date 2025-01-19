import bananaIcon from "/src/assets/banana.svg";
import mangoIcon from "/src/assets/mango.svg";
import crossIcon from "/src/assets/tiny-cross.svg";
import equalsIcon from "/src/assets/tiny-equals.svg";
import { MangoCell } from "@utils/types";

interface MangoSquareProps {
  cell: MangoCell;
  rowIndex: number;
  colIndex: number;
  handleCellClick: (rowIndex: number, colIndex: number) => void;
}

const MangoSquare = ({ cell, rowIndex, colIndex, handleCellClick }: MangoSquareProps) => {
  return (
    <div
      key={`${rowIndex}-${colIndex}`}
      onClick={() => handleCellClick(rowIndex, colIndex)}
      className="game-cell mango"
      style={{
        backgroundColor: cell.isFixed ? "#e5e5e5" : "#fff",
        borderBottom: rowIndex === 5 ? "1px solid #000" : "none",
        borderRight: colIndex === 5 ? "1px solid #000" : "none",
        borderTopRightRadius: rowIndex === 0 && colIndex === 5 ? "5px" : "0",
        borderBottomRightRadius: rowIndex === 5 && colIndex === 5 ? "5px" : "0",
        borderTopLeftRadius: rowIndex === 0 && colIndex === 0 ? "5px" : "0",
        borderBottomLeftRadius: rowIndex === 5 && colIndex === 0 ? "5px" : "0",
      }}
    >
      {cell.hasBanana && (
        <div className="cell-marker">
          <img className="cell-img" src={bananaIcon} alt="banana" />
        </div>
      )}
      {cell.hasMango && (
        <div className="cell-marker">
          <img className="cell-img" src={mangoIcon} alt="mango" />
        </div>
      )}
      {cell.hasRight.exists && (
        <div className="line-marker right">
          <img
            className="line-marker-img"
            src={cell.hasRight.isEquals ? equalsIcon : crossIcon}
            alt={cell.hasRight.isEquals ? "equals" : "cross"}
          />
        </div>
      )}
      {cell.hasBottom.exists && (
        <div className="line-marker bottom">
          <img
            className="line-marker-img"
            src={cell.hasBottom.isEquals ? equalsIcon : crossIcon}
            alt={cell.hasBottom.isEquals ? "equals" : "cross"}
          />
        </div>
      )}
    </div>
  );
};

export default MangoSquare;