import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { visuallyHidden } from "@mui/utils";
import Service from "../service/Service";
import { CryptoState } from "../CryptoContext";
import { useNavigate } from "react-router-dom";
import FavouriteIcon from "../asset/favourite.png";
import UnFavouriteIcon from "../asset/unfavouriteicon.png";
import {
  createTheme,
  LinearProgress,
  makeStyles,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const useStyles = makeStyles((theme) => ({
  red: {
    display: "flex",
    width: "50px",
    justifyContent: "center",

    backgroundColor: "#FF4B25",
    color: "black",
    borderRadius: 5,
  },
  green: {
    display: "flex",
    width: "50px",
    justifyContent: "center",
    backgroundColor: "#00FF19",
    color: "black",
    borderRadius: 5,
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
}

const headCells = [
  {
    id: "time",
    numeric: false,
    disablePadding: true,
    label: "Time",
  },
  {
    id: "coin",
    numeric: true,
    disablePadding: false,
    label: "Coin",
  },
  {
    id: "type",
    numeric: true,
    disablePadding: false,
    label: "Buy/Sell",
  },
  {
    id: "quantity",
    numeric: true,
    disablePadding: false,
    label: "Quantity",
  },
  {
    id: "profit",
    numeric: true,
    disablePadding: false,
    label: "Net amount paid/receive",
  },
  {
    id: "broker_fee",
    numeric: true,
    disablePadding: false,
    label: "Broker Fee",
  },
  {
    id: "total_gain",
    numeric: true,
    disablePadding: false,
    label: "Total buying/selling price",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ backgroundColor: "#FFE227", color: "black" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function EnhancedTable({ receipt }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(receipt?.length);

  const classes = useStyles();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleClick = () => {};
  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - receipt.length) : 0;

  React.useEffect(() => {
    setRowsPerPage(receipt?.length);
  }, [receipt]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{ width: "100%", mb: 2 }}
        style={{
          backgroundColor: "rgba(79, 58, 84, 0.52)",
          borderRadius: "15px",
        }}
      >
        <Paper elevation={7} />
        <TableContainer
          sx={{ maxHeight: 640 }}
          style={{ borderRadius: "15px" }}
        >
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            stickyHeader
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={receipt?.length}
            />

            <TableBody>
              {stableSort(receipt, getComparator(order, orderBy))
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  let date = new Date(row.time.seconds * 1000);
                  let timeparsed = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                  let dateparsed = date.toLocaleDateString();
                  return (
                    <TableRow
                      hover
                      onClick={() => handleClick()}
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: "white",
                        }}
                      >
                        <Typography style={{ marginRight: 20 }}>
                          {dateparsed}
                        </Typography>
                        <Typography>{timeparsed}</Typography>
                      </TableCell>
                      <TableCell align="right" style={{ color: "white" }}>
                        {row.coin?.toUpperCase()}
                      </TableCell>
                      <TableCell align="right">
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography
                            className={
                              row.type === "buy" ? classes.red : classes.green
                            }
                          >
                            {row.type?.toUpperCase()}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell align="right" style={{ color: "white" }}>
                        {row.quantity}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          color: row.profit > 0 ? "#33FF00" : "#FF0000",
                        }}
                      >
                        {row.profit?.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" style={{ color: "white" }}>
                        {row.broker_fee?.toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          color: row.total_gain > 0 ? "#33FF00" : "#FF0000",
                        }}
                      >
                        {row.total_gain?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
